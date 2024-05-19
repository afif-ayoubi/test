import { Type } from "class-transformer";
import { IsNotEmpty, IsString, IsEmail, IsIn, ValidateNested, IsOptional, validate } from "class-validator";

export class NotificationsDto {
    @IsNotEmpty()
    readonly fcm_token: string;




}


export class CreateUserDto {


    @IsNotEmpty()
    @IsEmail({ require_tld: true }, { message: "Invalid email format" })
    readonly email: string;

    @IsNotEmpty()
    readonly password: string;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => NotificationsDto)
    readonly notifications: NotificationsDto;

    readonly role: string;


}
