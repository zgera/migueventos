import { Request, Response, NextFunction } from "express"
import { JWTService } from "../services/JWTService";
import { TokenData } from "../types/auth";

// Extiende la interfaz Request para incluir 'usuario'
declare global {
  namespace Express {
    interface Request {
      user?: TokenData;
    }
  }
}

export function autenticarToken(req: Request, res: Response, next: NextFunction){
    const token = req.cookies.access_token

    if (!token){
        res.status(401).json({mensaje: "No autenticado"})
        return
    }

    try {
        const decoded = JWTService.validateToken(token)
        req.user = decoded
        next()
    } catch (error) {
        res.status(403).json({ mensaje: 'Token invalido o expirado' })
    }
}