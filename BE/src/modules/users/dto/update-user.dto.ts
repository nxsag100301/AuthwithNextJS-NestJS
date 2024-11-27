import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateUserDto {
    @IsMongoId({ message: "Invalid Id" })
    @IsNotEmpty()
    _id: string;
    @IsOptional()
    name: string;
    @IsOptional()
    phone: string;
    @IsOptional()
    address: string;
    @IsOptional()
    image: string;
    @IsOptional()
    isActive: boolean;
}

export class UpdateVerifyUserDto {
    @IsMongoId({ message: "Invalid Id" })
    @IsNotEmpty()
    _id: string
    @IsNotEmpty()
    isActive: boolean;
}
