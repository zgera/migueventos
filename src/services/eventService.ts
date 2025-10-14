import { TokenData } from "../types/auth";
import { Event, UserEvent } from "@prisma/client";
import { BalanceService } from "./balanceService";
import { UserEventRepository } from "../repositories/userEventRepository";
import { EventRepository } from "../repositories/eventRepository";
import { AuthorizationService } from "./authorizationService";

interface accessStrategy {
    access(token: TokenData, event: Event): Promise<Event>;
    leave(token: TokenData, event: Event): Promise<void>;
}

class PaidStrategy implements accessStrategy {
    async access(token: TokenData, event: Event): Promise<Event> {
        if (!event.price) {
            throw new Error("Este evento requiere pago");
        }
        await UserEventRepository.createUserEvent(token.userId, event.idEvent, false);
        await BalanceService.pay(token, event.price);
        return event;
    }
    async leave(token: TokenData, event: Event): Promise<void> {
        throw new Error("No se puede salir de un evento pago");
    }
}

class FreeStrategy implements accessStrategy {
    async access(token: TokenData, event: Event): Promise<Event> {
        await UserEventRepository.createUserEvent(token.userId, event.idEvent, false);
        return event;
    }
    async leave(token: TokenData, event: Event): Promise<void> {
        await AuthorizationService.assertParticipant(token, event.idEvent);
        await UserEventRepository.deleteUserEvent(token.userId, event.idEvent);
    }
}

export class EventService {
    
    async getEvent(idEvent: string): Promise<Event> {
        const event = await EventRepository.getEventById(idEvent);

        if (!event) {
            throw new Error("Evento no encontrado");
        }

        return event;
    }

    private selectStrategy(event: Event): accessStrategy {
        return event.Free ? new FreeStrategy() : new PaidStrategy();
    }

    async leaveEvent(token: TokenData, idEvent: string): Promise<void> {
        const event = await this.getEvent(idEvent);
        const strategy = this.selectStrategy(event);
        return await strategy.leave(token, event);
    }

    async accessEvent(token: TokenData, idEvent: string): Promise<Event> {
        const event = await this.getEvent(idEvent);
        const strategy = this.selectStrategy(event);
        return await strategy.access(token, event);
    }

    async createEvent(token: TokenData, title: string, description: string, shortDescription: string, direction: string, date: Date, price: number | null, free: boolean): Promise<Event> {
        const event = await EventRepository.createEvent(title, description, shortDescription, direction, date, price, free);
        await UserEventRepository.createUserEvent(token.userId, event.idEvent, true);
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