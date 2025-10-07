import { User } from '@prisma/client';
import { UserSafe, CreateUserBody } from '../types/user';
import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/userRepository';

const MAX_CHARACTERS_FOR_USERNAME = 15
const MIN_CHARACTERS_FOR_USERNAME = 4
const MIN_CHARACTERS_FOR_PASSWORD = 6
const CHARACTERS_NOT_ALLOWED = /[<>'"{}()\/\\]/ // (regex)
const saltRounds = 10

export class AuthenticationService {

    async signUp(userData: CreateUserBody): Promise<UserSafe> {
        await UserValidator.validate(userData);
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

        try {
            const user = await UserRepository.createUser(userData.username, userData.firstName, userData.lastName, userData.document, userData.email, hashedPassword);
            return this.createUserSafe(user);
        } catch (error) {
            throw new Error("Error al crear el usuario.");
        }
    }

    async signIn(username: string, password: string): Promise<UserSafe> {
        if (!username || !password) {
            throw new Error("Todos los campos son obligatorios");
        }
        const user = await this.getUserCompleteByUsername(username);

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error("Contraseña incorrecta");
        }
        return this.createUserSafe(user);
    }

    private createUserSafe(user: User): UserSafe {
        const { password, ...userSafe } = user;
        return userSafe;
    }


    private async getUserCompleteByUsername(username: string): Promise<User> {
        if (!username) {
            throw new Error("El id del usuario es obligatorio")
        }

        const user = await UserRepository.findByUsername(username)

        if (!user) {
            throw new Error("Usuario no encontrado")
        }

        return user
    }
}

class UserValidator {
    static async validate(userData: CreateUserBody): Promise<boolean> {
        await this.validateUsername(userData.username)
        this.validatePassword(userData.password)
        this.validateName(userData.firstName)
        this.validateName(userData.lastName)
        return true;
    }

    private static async validateUsername(username: string): Promise<void> {
        this.validateName(username)
        let existing = await UserRepository.findByUsername(username)
        if (existing) {
            throw new Error("Ese nombre ya esta ocupado.")
        }
    }

    private static validateName(name: string): void {
        if (name.length > MAX_CHARACTERS_FOR_USERNAME) {
            throw Error(`Los nombres no pueden tener mas de ${MAX_CHARACTERS_FOR_USERNAME} o menos de ${MIN_CHARACTERS_FOR_USERNAME} caracteres.`)
        }
        if (CHARACTERS_NOT_ALLOWED.test(name)) {
            throw Error(`Los nombres no pueden contener caracteres especiales.`)
        }
    }

    private static validatePassword(password: string): void {
        if (password.length < MIN_CHARACTERS_FOR_PASSWORD) {
            throw Error(`La contraseña no puede tener menos de ${MIN_CHARACTERS_FOR_PASSWORD} caracteres.`)
        }
    }
}