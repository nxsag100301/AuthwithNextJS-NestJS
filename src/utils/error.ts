import { AuthError } from "next-auth";

export class CustomAuthError extends AuthError {
    static type: string;

    constructor(message?: any) {
        super();

        this.type = message;
    }
}

export class InvalidEmailPasswordError extends AuthError {
    static type = "Invalid Email/Password"

}

export class InActiveAccountError extends AuthError {
    static type = "Account has not been activated"
}