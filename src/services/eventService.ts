import { TokenData } from "../types/auth";
import { Event, Ticket } from "@prisma/client";
import { BalanceService } from "./balanceService";
import { TicketRepository } from "../repositories/ticketRepository";
import { EventRepository } from "../repositories/eventRepository";
import { AuthorizationService } from "./authorizationService";
import { TicketDetailRepository } from "../repositories/ticketDetailRepository";
import { UserRepository } from "../repositories/userRepository";
import { UserService } from "./userService";

interface participantDetail{
    firstName: string,
    lastName: string,
    document: number
}

abstract class accessStrategy {
    abstract access(token: TokenData, event: Event, participants: number, participantsDetails: participantDetail[]): Promise<Ticket>;

    abstract leave(token: TokenData, event: Event): Promise<void>;

    protected calculateTicketAmount(participants: number, price: number): number{
        return participants * price
    }

    protected async checkParticipants(participantsDetails: participantDetail[], event: Event){
        for (const participant of participantsDetails){
            if (await TicketDetailRepository.getDetailByDocumentAndEvent(participant.document, event.idEvent)){
                throw new Error("Un participante ya asiste al evento")
            }
        }
    }

    protected async createTicketDetails(participantsDetails: participantDetail[], event: Event, price: number, ticketID: string): Promise<void>{
        for (const participant of participantsDetails){
            await TicketDetailRepository.createTicketDetail(participant.firstName, participant.lastName, participant.document, ticketID, event.idEvent, price)
        }
    }
}

class PaidStrategy extends accessStrategy {
    async access(token: TokenData, event: Event, participants: number, participantsDetails: participantDetail[]): Promise<Ticket> {
        if (!event.price) {
            throw new Error("Este evento requiere pago");
        }

        await this.checkParticipants(participantsDetails, event)

        const amount = this.calculateTicketAmount(participants, event.price)

        await BalanceService.pay(token, event.price);

        const ticket = await TicketRepository.createTicket(token.userId, event.idEvent, participants, amount);

        await this.createTicketDetails(participantsDetails, event, event.price, ticket.idTicket)

        return ticket;
    }

    async leave(token: TokenData, event: Event): Promise<void> {
        throw new Error("No se puede salir de un evento pago");
    }
}

class FreeStrategy extends accessStrategy {
    async access(token: TokenData, event: Event, participants: number, participantsDetails: participantDetail[]): Promise<Ticket> {
        await this.checkParticipants(participantsDetails, event)

        const ticket = await TicketRepository.createTicket(token.userId, event.idEvent, participants, 0);

        await this.createTicketDetails(participantsDetails, event, 0, ticket.idTicket)

        return ticket;
    }
    async leave(token: TokenData, event: Event): Promise<void> {
        await AuthorizationService.assertParticipant(token, event.idEvent);
        await TicketRepository.deleteTicket(token.userId, event.idEvent);
    }
}

export class EventService {

    userService = new UserService()
    
    async getEvent(idEvent: string): Promise<Event> {
        const event = await EventRepository.getEventById(idEvent);

        if (!event) {
            throw new Error("Evento no encontrado");
        }

        return event;
    }

    private selectStrategy(event: Event): accessStrategy {
        return event.free ? new FreeStrategy() : new PaidStrategy();
    }

    async leaveEvent(token: TokenData, idEvent: string): Promise<void> {
        const event = await this.getEvent(idEvent);
        const strategy = this.selectStrategy(event);
        return await strategy.leave(token, event);
    }

    async accessEvent(token: TokenData, idEvent: string, participants: number, participantsDetails: participantDetail[]): Promise<Ticket> {
        const event = await this.getEvent(idEvent);

        if (event.completed){
            throw new Error("El evento ya ha finalizado")
        }

        const strategy = this.selectStrategy(event);
        return await strategy.access(token, event, participants, participantsDetails);
    }

    async createEvent(token: TokenData, title: string, description: string, shortDescription: string, direction: string, date: Date, price: number | null, free: boolean): Promise<Event> {
        const event = await EventRepository.createEvent(title, description, shortDescription, direction, date, price, free, token.userId);

        const user = await this.userService.getUserById(token.userId)

        const ticket = await TicketRepository.createTicket(token.userId, event.idEvent, 1, 0)

        await TicketDetailRepository.createTicketDetail(user.firstName, user.lastName, user.document, ticket.idTicket, event.idEvent, 0)

        return event;
    }

    async deleteEvent(token: TokenData, idEvent: string): Promise<Event> {
        const event = await this.getEvent(idEvent);

        await AuthorizationService.assertAdmin(token, event.idEvent);

        return await EventRepository.deleteEvent(idEvent);
    }

    async completeEvent(token: TokenData, idEvent: string): Promise<Event> {
        //IMPLEMENTAR
        throw new Error("Not implemented");
    }
}