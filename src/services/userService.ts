import { UserRepository } from "../repositories/userRepository";
import { User } from "@prisma/client";

export class UserService {
    async getUserById(idUser: string): Promise<User> {
        const user = await UserRepository.findById(idUser);
        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        return user;
    }
}