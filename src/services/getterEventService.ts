import { TicketRepository } from "../repositories/ticketRepository";
import { TicketDetailRepository } from "../repositories/ticketDetailRepository";
import { EventRepository } from "../repositories/eventRepository";
import { AuthorizationService } from "./authorizationService";
import { EventService } from "./eventService";
import { UserService } from "./userService";
import { TokenData } from "../types/auth";
import { Event } from "@prisma/client";
import { User } from "@prisma/client";
import { Ticket } from "@prisma/client";
import { TicketDetail } from "@prisma/client";

export class GetterEventService {
    

    async getTicket(ticketID: string): Promise<Ticket>{
        const ticket = await TicketRepository.getTicket(ticketID)
        if (!ticket){
            throw new Error("No existe el ticket")
        }
        return ticket
    }

    async getTicketsByUser(token: TokenData): Promise<Ticket[]> {
        const tickets = await TicketRepository.getTicketByUserId(token.userId)
        return tickets
    }
    
    async getTicketDetail(token: TokenData, ticketID: string): Promise<TicketDetail[]>{

        const ticket = await this.getTicket(ticketID)

        if (ticket.idUser !== token.userId){
            throw new Error("El ticket no es tuyo")
        }

        const ticketDetail = await TicketDetailRepository.getTicketDetailByTicket(ticketID)
        return ticketDetail
    }

    async getTicketDetailsByEvent(token: TokenData, idEvent: string): Promise<TicketDetail[]>{
        
        await AuthorizationService.assertAdmin(token, idEvent)

        const ticketDetails = await TicketDetailRepository.getTicketDetailByEvent(idEvent)

        return ticketDetails
    }

    async getTicketsByEvent(token: TokenData, idEvent: string): Promise<Ticket[]> {
        await AuthorizationService.assertAdmin(token, idEvent);
        const tickets = await TicketRepository.getTicketByEventId(idEvent);
        return tickets
    }

    async getEvents(): Promise<Event[]> {
        return EventRepository.getEvents();
    }

    async getMyEvents(token: TokenData): Promise<Event[]> {
        if (!token){
            throw new Error("Token requerido")
        }

        return EventRepository.getMyEvents(token.userId)
    }

}