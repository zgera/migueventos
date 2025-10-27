import { TicketDetail } from "@prisma/client";

import { db } from "../db/db";

export class TicketDetailRepository {
    static async createTicketDetail(firstName: string, lastName: string, document: number, ticketID: string, eventID: string, amount: number): Promise<TicketDetail>{
        const ticketDetail = await db.ticketDetail.create({
            data: {
                ticketID,
                eventID,
                firstName,
                lastName,
                document,
                amount
            }
        })
        return ticketDetail
    }

    static async getDetailByDocumentAndEvent(document: number, eventID: string): Promise<TicketDetail | null>{
        return await db.ticketDetail.findFirst({
            where: {
                eventID,
                document
            }
        })
    }

    static async getTicketDetailByTicket(ticketID: string): Promise<TicketDetail[]>{
        return await db.ticketDetail.findMany({
            where: {
                ticketID
            }
        })
    }

    static async getTicketDetailByEvent(eventID: string): Promise<TicketDetail[]>{
        return await db.ticketDetail.findMany({
            where: {
                eventID
            }
        })
    }
}   