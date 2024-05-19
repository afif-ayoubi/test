import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import 'dotenv/config';
import { Model } from "mongoose";
import { ERROR_MESSAGES } from "src/core/constants/error_message";
import { ModelUnprocessableEnitityException } from "src/core/error/exception";
import { User } from "src/schemas/user.schema";

const OTP='otp';
@Injectable()
export class OtpService {
    private otps = new Map<string, string>();

    constructor(private readonly mailService: MailerService,
        @InjectModel(User.name) private userModel: Model<User>,
    ) {}

    async sendMail(email: string): Promise<void> {
        const user = await this.userModel.findOne({ email });
        if (!user) throw new ModelUnprocessableEnitityException(ERROR_MESSAGES.USER_NOT_FOUND);

        const otp = this.generateOtp();
        const message = `Your OTP code is ${otp}. If you didn't request this, please ignore this email.`;

        try {
            await this.mailService.sendMail({
                from: process.env.USER,
                to: email,
                subject: `Your OTP Code`,
                text: message,
            });

            this.otps.set(OTP, otp); 
            console.log(this.otps) 
        } catch (error) {
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }

    generateOtp(): string {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    verifyOtp( otp: string): boolean {
        const storedOtp = this.otps.get(OTP);
        if (storedOtp === otp) {
            this.otps.delete(OTP); // OTP is used, remove it
            return true;
        }
        return false;
    }
}
