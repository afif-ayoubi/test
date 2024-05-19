import { IsNotEmpty, IsString, IsEmail, IsIn, ValidateNested } from "class-validator";

export class LoginDto {


    @IsNotEmpty()
    @IsEmail({ require_tld: true }, { message: "Invalid email format" })
    readonly email: string;

    @IsNotEmpty()
    readonly password: string;

   
}
