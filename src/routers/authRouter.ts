import {Router, Request, Response} from "express"

import { JWTService } from "../services/JWTService";
import { TokenData } from "../types/auth";
import { IAuthenticationService } from "../types/IAuthenticactionService";
import { CreateUserBody } from "../types/user";

export class AuthRouter {
    public router: Router;

    private authenticationService: IAuthenticationService;

    constructor(authenticationService: IAuthenticationService){
        this.authenticationService = authenticationService;
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post("/signup", this.signUp);
        this.router.post("/signin", this.signIn);
    }

    private signUp = async (req: Request, res: Response) => {
        const { firstName, lastName, username, document, email, password } = req.body;

        const userBody: CreateUserBody = { firstName, lastName, username, document, email, password };

        try {
            const user = await this.authenticationService.signUp(userBody);
            res.status(201).json(user);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error inesperado al iniciar sesión';
            res.status(401).send({ error: message });
        }
    }

    private signIn = async (req: Request, res: Response) => {
        const { username, password } = req.body;
        try {
            const user = await this.authenticationService.signIn(username, password);

            const tokenData: TokenData = {
                userId: user.idUser,
                username: user.username
            };

            const token = JWTService.createToken(tokenData);

            res
                .cookie('access_token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: 'strict',
                    maxAge: 1000 * 60 * 60
                })
                .status(200)
                .send({ user });

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error inesperado al iniciar sesión';
            res.status(401).send({ error: message });
        }
    }
}
