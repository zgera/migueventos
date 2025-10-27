import { Router, Request, Response } from "express";
import { EventService } from "../services/eventService";
import { autenticarToken } from "../middleware/authMiddleware";
import { TokenData } from "../types/auth";

const eventService = new EventService();
export const eventRouter = Router();

/**
 * Acceder a un evento (comprar ticket o entrar si es gratis)
 */
eventRouter.post("/access/:id", autenticarToken, async (req: Request, res: Response) => {
    const token = req.user!;
    const idEvent = req.params.id;
    const { participants, participantsDetails } = req.body;

    try {
        const ticket = await eventService.accessEvent(token, idEvent, participants, participantsDetails);
        res.status(200).send({ ticket });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error inesperado al acceder al evento";
        res.status(401).send({ error: message });
    }
});

/**
 * Abandonar un evento (devolver entrada o cancelar asistencia)
 */
eventRouter.post("/leave/:id", autenticarToken, async (req: Request, res: Response) => {
    const token = req.user!;
    const idEvent = req.params.id;

    try {
        await eventService.leaveEvent(token, idEvent);
        res.status(200).send({ message: "Has salido del evento correctamente" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error inesperado al salir del evento";
        res.status(401).send({ error: message });
    }
});

/**
 * Crear un nuevo evento
 */
eventRouter.post("/create", autenticarToken, async (req: Request, res: Response) => {
    const token = req.user!;
    const { title, description, shortDescription, direction, date, price, free } = req.body;

    try {
        const event = await eventService.createEvent(token, title, description, shortDescription, direction, new Date(date), price, free);
        res.status(201).send({ event });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error inesperado al crear el evento";
        res.status(400).send({ error: message });
    }
});

/**
 * Eliminar un evento (solo administrador)
 */
eventRouter.delete("/delete/:id", autenticarToken, async (req: Request, res: Response) => {
    const token = req.user!;
    const idEvent = req.params.id;

    try {
        const deletedEvent = await eventService.deleteEvent(token, idEvent);
        res.status(200).send({ event: deletedEvent });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error inesperado al eliminar el evento";
        res.status(401).send({ error: message });
    }
});

/**
 * Completar un evento (marcar como finalizado, SOLO ADMIN)
 */
eventRouter.post("/complete/:id", autenticarToken, async (req: Request, res: Response) => {
    const token = req.user!;
    const idEvent = req.params.id;

    try {
        const completedEvent = await eventService.completeEvent(token, idEvent);
        res.status(200).send({ event: completedEvent });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error inesperado al completar el evento";
        res.status(501).send({ error: message });
    }
});
