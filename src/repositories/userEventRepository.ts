import { UserEvent } from "@prisma/client";

import { db } from "../db/db";

export class UserEventRepository {
    static async createUserEvent(idUser: string, idEvent: string, admin: boolean): Promise<UserEvent> {
        const userEvent = await db.userEvent.create({
            data: {
                idUser,
                idEvent,
                admin
            }
        });
        return userEvent;
    }

    static async deleteUserEvent(idUser: string, idEvent: string): Promise<void> {
        await db.userEvent.deleteMany({
            where: {
                idUser,
                idEvent
            }
        });
    }

    static async getUserEvent(idUser: string, idEvent: string): Promise<UserEvent | null> {
        return db.userEvent.findFirst({
            where: {
                idUser,
                idEvent
            }
        });
    }

    static async getUserEventsByUserId(idUser: string): Promise<UserEvent[]> {
        return db.userEvent.findMany({
            where: { idUser }
        });
    }

    static async getUserEventsByEventId(idEvent: string): Promise<UserEvent[]> {
        return db.userEvent.findMany({
            where: { idEvent }
        });
    }
}