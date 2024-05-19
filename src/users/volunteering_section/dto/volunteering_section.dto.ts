import { IsNotEmpty, IsString } from "class-validator";

export class VolunteeringSectionDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;
    
    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsString()
    @IsNotEmpty()
    readonly imageUrl: string;
}