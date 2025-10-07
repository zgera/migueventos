import jwt from "jsonwebtoken"
import { TokenData } from "../types/auth"

export class JWTService{
    static createToken(tokenData: TokenData){
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined in environment variables.");
        }
        const token = jwt.sign(
            {userId: tokenData.userId, username: tokenData.username},
            secret,
            {
                expiresIn: "1h"
        })
        return token
    }

    static validateToken(encodedToken: string): TokenData {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined in environment variables.");
        }
        const decodedToken = jwt.verify(encodedToken, secret) as unknown as TokenData;
        return decodedToken;
    }
}