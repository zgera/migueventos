import { User } from "@prisma/client";

import { db } from "../db/db";

export class UserRepository {

    static async createUser(username: string, firstName: string, lastName: string, document: number, email: string, password: string): Promise<User> {
        const user = await db.user.create({
            data: {
                firstName,
                lastName,
                username,
                document,
                email,
                password
            }
        });
        return user;
    }

    static async findByUsername(username: string): Promise<User | null> {
        return db.user.findUnique({
            where: { username }
        });
    }

    static async findById(idUser: string): Promise<User | null> {
        return db.user.findUnique({
            where: { idUser }
        });
    }

    static async updateBalance(userId: string, newBalance: number): Promise<User> {
        return db.user.update({
            where: { idUser : userId },
            data: { balance: newBalance }
        });
    }

    static async changeConfirmed(userId: string, value: number): Promise<User> {
        return db.user.update({
            where: { idUser : userId },
            data: { confirmed: { increment: value } }
        });
    }

    static async changeBought(userId: string, value: number): Promise<User> {
        return db.user.update({
            where: { idUser : userId },
            data: { bought: { increment: value } }
        });
    }
    
}