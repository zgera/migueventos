import { UserRepository } from "../repositories/userRepository";
import { TokenData } from "../types/auth";

export class BalanceService {
    static async getBalance(token: TokenData): Promise<number> {
        const user = await UserRepository.findByUsername(token.username);
        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        return user.balance;
    }

    static async increaseBalance(token: TokenData, amount: number): Promise<number> {
        if (amount <= 0) {
            throw new Error("El monto a incrementar debe ser mayor que cero");
        }
        const balance = await this.getBalance(token);
        const newBalance = balance + amount;
        await UserRepository.updateBalance(token.userId, newBalance);
        return newBalance;
    }

    static async pay(token: TokenData, amount: number): Promise<number> {
        if (amount <= 0) {
            throw new Error("El monto a pagar debe ser mayor que cero");
        }
        const balance = await this.getBalance(token);
        if (balance < amount) {
            throw new Error("Saldo insuficiente");
        }
        const newBalance = balance - amount;
        await UserRepository.updateBalance(token.userId, newBalance);
        return newBalance;
    }
}