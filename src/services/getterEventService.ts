import { UserEventRepository } from "../repositories/userEventRepository";
import { EventRepository } from "../repositories/eventRepository";
import { AuthorizationService } from "./authorizationService";
import { EventService } from "./eventService";
import { UserService } from "./userService";
import { TokenData } from "../types/auth";
import { Event } from "@prisma/client";
import { User } from "@prisma/client";

export class GetterEventService {

    private eventService: EventService = new EventService();
    private userService: UserService = new UserService();

    async getEventsByUser(token: TokenData): Promise<Event[]> {
        const userEvents = await UserEventRepository.getUserEventsByUserId(token.userId);
        const events = await Promise.all(userEvents.map(async (userEvent) => {
            const event = await this.eventService.getEvent(userEvent.idEvent);
            return event;
        }));
        return events;
    }

    async getParticipantsByEvent(token: TokenData, idEvent: string): Promise<User[]> {
        await AuthorizationService.assertAdmin(token, idEvent);
        const userEvents = await UserEventRepository.getUserEventsByEventId(idEvent);
        const users = await Promise.all(userEvents.map(async (userEvent) => {
            const user = await this.userService.getUserById(userEvent.idUser);
            return user;
        }));
        return users;
    }

    async getEvents(token: TokenData): Promise<Event[]> {
        if (!token) {
            throw new Error("Token requerido");
        }
        return EventRepository.getEvents();
    }
}