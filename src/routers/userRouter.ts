import { Router, Request, Response } from "express";
import { autenticarToken } from "../middleware/authMiddleware";
import { UserService } from "../services/userService";

const userService = new UserService();
export const userRouter = Router();

// Obtener usuario por ID (del token)
userRouter.get("/me", autenticarToken, async (req: Request, res: Response) => {
    const token = req.user!; // viene del middleware

    try {
        const user = await userService.getUserById(token.userId);
        res.status(200).send({ user });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error inesperado al obtener usuario";
        res.status(404).send({ error: message });
    }
});