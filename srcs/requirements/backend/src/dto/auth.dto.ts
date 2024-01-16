import { IsEmail, IsNotEmpty, IsString } from 'class-validator';


export class singupdto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    // @IsNotEmpty()
    // @IsString()
    // password: string;             
}

export class singindto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}