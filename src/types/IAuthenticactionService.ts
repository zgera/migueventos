import {CreateUserBody, UserSafe} from "./user";

export interface IAuthenticationService {
    signUp(createUserBody: CreateUserBody): Promise<UserSafe>;
    signIn(username: string, password: string): Promise<UserSafe>;
}