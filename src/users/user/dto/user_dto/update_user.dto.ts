import { Type } from "class-transformer";
import { IsDateString, IsEmail, IsIn, IsOptional, IsString, ValidateNested } from "class-validator";
import { USER_GENDERS } from "src/users/user/utils/user_genders_enum";

export class UserInfoDto {
    @IsOptional()
    @IsString()
    readonly phone?: number;
    @IsOptional()
    @IsIn(Object.values(USER_GENDERS), { message: "Invalid Gender" })
    @IsString()
    readonly gender?: String;
    @IsOptional()
    @IsDateString()
    readonly dateOfBirth?: Date;
    @IsOptional()
    @IsString()
    readonly image?: String;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    readonly firstName: string;
    @IsOptional()
    @IsString()
    readonly lastName: string;
    @IsOptional()
    @IsEmail({ require_tld: true }, { message: "Invalid email format" })
    readonly email: string;
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => UserInfoDto)
    readonly userInfo: UserInfoDto;

}
