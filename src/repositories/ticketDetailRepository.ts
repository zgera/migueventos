import { TicketDetail } from "@prisma/client";

import { db } from "../db/db";

export class TicketDetailRepository {
    static async createTicketDetail(firstName: string, lastName: string, document: number, ticketID: string, eventID: string, amount: number): Promise<TicketDetail>{
        try {
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
        } catch (error) {
            throw new Error("Error al crear el detalle del ticket")
        }
    }

    static async getDetailByDocumentAndEvent(document: number, eventID: string): Promise<TicketDetail | null>{
        try {
        return await db.ticketDetail.findFirst({
            where: {
                eventID,
                document
            }
        })
        } catch (error) {
            throw new Error("Documento ingresado no valido")
        }
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