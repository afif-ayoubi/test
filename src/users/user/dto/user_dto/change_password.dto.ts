import { IsString, IsEmail } from 'class-validator';

export class ChangePasswordDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly newPassword: string;
}
