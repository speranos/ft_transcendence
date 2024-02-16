import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class auth42dto{
    @IsString()
    @IsNotEmpty()
    ID : string
    @IsString()
    @IsNotEmpty()
    userName : string;
    @IsEmail()
    @IsNotEmpty()
    email : string;
    @IsString()
    @IsNotEmpty()
    link : string;
}