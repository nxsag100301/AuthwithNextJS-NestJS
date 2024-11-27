import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    password: string;
    @IsNotEmpty()
    name: string;
    phone: string;
    address: string;
}

export class VerifyAuthDto {
    @IsNotEmpty()
    id: string;
    @IsNotEmpty()
    code: string;
}

export class RetryPasswordDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    code: string;

    @IsNotEmpty()
    password: string;

}
