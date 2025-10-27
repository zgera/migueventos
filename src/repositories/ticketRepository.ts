import { Ticket } from "@prisma/client";

import { db } from "../db/db";

export class TicketRepository {
    static async createTicket(idUser: string, idEvent: string, participants: number, amount: number): Promise<Ticket> {
        const userEvent = await db.ticket.create({
            data: {
                idUser,
                idEvent,
                participants,
                amount
            }
        });
        return userEvent;
    }

    static async deleteTicket(idUser: string, idEvent: string): Promise<void> {
        await db.ticket.deleteMany({
            where: {
                idUser,
                idEvent
            }
        });
    }

    static async getTicket(idTicket: string): Promise<Ticket | null> {
        return await db.ticket.findFirst({
            where: {
                idTicket
            }
        });
    }

    static async getTicketByUserId(idUser: string): Promise<Ticket[]> {
        return await db.ticket.findMany({
            where: { idUser },
            include: {
                event: true
            }
        });
    }

    static async getTicketByEventId(idEvent: string): Promise<Ticket[]> {
        return await db.ticket.findMany({
            where: { idEvent },
            include: {
                event: true, 
                user: true
            }
        });
    }
}