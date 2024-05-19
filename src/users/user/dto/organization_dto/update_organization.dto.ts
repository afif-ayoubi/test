import { IsNotEmpty, IsString, IsEmail, IsIn, ValidateNested, IsOptional, validate, IsNumber, isNotEmpty } from "class-validator";
import { Type } from "class-transformer";
import { VolunteeringSectionDto } from "src/users/volunteering_section/dto/volunteering_section.dto";

export class UpdateLiveStreamingDto {
    @IsOptional()
    @IsString()
    readonly liveStremingId: string;

    @IsOptional()
    @IsIn([true, false])
    readonly isActivated: boolean;

}

export class UpdateLocationDto {
    @IsOptional()
    @IsNumber()
    readonly longitude: number;


    @IsOptional()
    @IsNumber()
    readonly latitude: number;
}

export class UpdateOrganizationDetailDto {
    
    @IsString()
    @IsOptional()
    readonly aboutUs: string;

    @IsString()
    @IsOptional()
    readonly howToVolunteer: string;

    @IsString()
    @IsOptional()
    readonly imageUrl: string;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => UpdateLocationDto)
    readonly location: UpdateLocationDto

    @ValidateNested({ each: true })
    @Type(() => VolunteeringSectionDto)
    readonly VolunteeringSection: VolunteeringSectionDto;
}
export class UpdateOrganizationDto {
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
    readonly password: string;

    readonly liveStreamingId: string;

    readonly role: string;

    readonly isActive: boolean;

    @ValidateNested({ each: true })
    @Type(() => UpdateLiveStreamingDto)
    readonly liveStreaming: UpdateLiveStreamingDto

    @ValidateNested({ each: true })
    @Type(() => UpdateOrganizationDetailDto)
    readonly organizationDetail: UpdateOrganizationDetailDto


}
