import { UserEventRepository } from "../repositories/userEventRepository";
import { TokenData } from "../types/auth";


export class AuthorizationService {
    static async isAdmin(token: TokenData, idEvent: string): Promise<boolean> {
        const userEvent = await UserEventRepository.getUserEvent(token.userId, idEvent);
        return userEvent?.admin || false;
    }

    static async assertAdmin(token: TokenData, idEvent: string): Promise<void> {
        const isAdmin = await this.isAdmin(token, idEvent);
        if (!isAdmin) {
            throw new Error("No tienes permisos de administrador para este evento");
        }
    }

    static async isParticipant(token: TokenData, idEvent: string): Promise<boolean> {
        const userEvent = await UserEventRepository.getUserEvent(token.userId, idEvent);
        return !!userEvent;
    }

    static async assertParticipant(token: TokenData, idEvent: string): Promise<void> {
        const isParticipant = await this.isParticipant(token, idEvent);
        if (!isParticipant) {
            throw new Error("No eres participante de este evento");
        }
    }
}