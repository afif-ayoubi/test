import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
    constructor(private readonly otpService: OtpService) {}

    @Post('send')
    async sendOtp(@Body('email') email: string): Promise<{ message: string }> {
        if (!email) {
            throw new BadRequestException('Email is required');
        }

        await this.otpService.sendMail(email);
        return { message: 'OTP sent successfully' };
    }

    @Post('verify')
    verifyOtp( @Body('otp') otp: string): { isValid: boolean } {
        

        const isValid = this.otpService.verifyOtp( otp);
        return { isValid };
    }
}
