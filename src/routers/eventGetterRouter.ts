import { Router, Request, Response } from "express";
import { GetterEventService } from "../services/getterEventService";
import { autenticarToken } from "../middleware/authMiddleware";
import { TokenData } from "../types/auth";

const getterEventService = new GetterEventService();
export const getterEventRouter = Router();


/**
 * Obtener todos los tickets del usuario autenticado
 */
getterEventRouter.get("/tickets/user", autenticarToken, async (req: Request, res: Response) => {
    const token = req.user!;

    try {
        const tickets = await getterEventService.getTicketsByUser(token);
        res.status(200).send({ tickets });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error inesperado al obtener los tickets del usuario";
        res.status(401).send({ error: message });
    }
});

/**
 * Obtener el detalle de un ticket (solo si pertenece al usuario)
 */
getterEventRouter.get("/ticket/detail/:id", autenticarToken, async (req: Request, res: Response) => {
    const token = req.user!;
    const ticketID = req.params.id;

    try {
        const ticketDetail = await getterEventService.getTicketDetail(token, ticketID);
        res.status(200).send({ ticketDetail });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error inesperado al obtener el detalle del ticket";
        res.status(401).send({ error: message });
    }
});

/**
 * Obtener los detalles de tickets de un evento (solo admin del evento)
 */
getterEventRouter.get("/event/:id/details", autenticarToken, async (req: Request, res: Response) => {
    const token = req.user!;
    const idEvent = req.params.id;

    try {
        const ticketDetails = await getterEventService.getTicketDetailsByEvent(token, idEvent);
        res.status(200).send({ ticketDetails });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error inesperado al obtener los detalles del evento";
        res.status(401).send({ error: message });
    }
});

/**
 * Obtener todos los tickets de un evento (solo admin del evento)
 */
getterEventRouter.get("/event/:id/tickets", autenticarToken, async (req: Request, res: Response) => {
    const token = req.user!;
    const idEvent = req.params.id;

    try {
        const tickets = await getterEventService.getTicketsByEvent(token, idEvent);
        res.status(200).send({ tickets });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error inesperado al obtener los tickets del evento";
        res.status(401).send({ error: message });
    }
});

/**
 * Obtener todos los eventos (visibles para cualquier usuario, no autenticado)
 */
getterEventRouter.get("/events", async (req: Request, res: Response) => {

    try {
        const events = await getterEventService.getEvents();
        res.status(200).send({ events });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error inesperado al obtener los eventos";
        res.status(401).send({ error: message });
    }
});

/**
 * Obtener los eventos creados por el usuario
 */
getterEventRouter.get("/myEvents", autenticarToken, async (req: Request, res: Response) => {
    const token = req.user!;
    try {
        const events = await getterEventService.getMyEvents(token);
        res.status(200).send({ events });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error inesperado al obtener los eventos";
        res.status(401).send({ error: message });
    }
});
