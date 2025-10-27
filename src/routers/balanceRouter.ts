import { Router, Request, Response } from "express";
import { BalanceService } from "../services/balanceService";
import { autenticarToken } from "../middleware/authMiddleware";
import { TokenData } from "../types/auth";

export const balanceRouter = Router();

/**
 * Obtener el balance actual del usuario autenticado
 */
balanceRouter.get("/get", autenticarToken, async (req: Request, res: Response) => {
    const token = req.user!;

    try {
        const balance = await BalanceService.getBalance(token);
        res.status(200).send({ balance });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error inesperado al obtener el balance";
        res.status(401).send({ error: message });
    }
});

/**
 * Incrementar el balance del usuario autenticado
 */
balanceRouter.post("/increase", autenticarToken, async (req: Request, res: Response) => {
    const token = req.user!;
    const { amount } = req.body;

    try {
        const newBalance = await BalanceService.increaseBalance(token, amount);
        res.status(200).send({ balance: newBalance });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error inesperado al incrementar el balance";
        res.status(401).send({ error: message });
    }
});
