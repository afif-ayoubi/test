import { IsNotEmpty, IsString, IsEmail, ValidateNested, IsBoolean } from "class-validator";
import { Type } from "class-transformer";
import { VolunteeringSectionDto } from "src/users/volunteering_section/dto/volunteering_section.dto";

export class LiveStreamingDto {
    readonly liveStremingId: string;
    @IsBoolean()
    readonly isActivated: boolean;
}

export class LocationDto {
    readonly longitude: number;
    readonly latitude: number;
}

export class OrganizationDetailDto {
    @IsString()
    @IsNotEmpty()
    readonly aboutUs: string;

    @IsString()
    @IsNotEmpty()
    readonly howToVolunteer: string;

    @IsString()
    @IsNotEmpty()
    readonly imageUrl: string;

    @ValidateNested()
    @Type(() => LocationDto)
    readonly location: LocationDto;

    @ValidateNested()
    @Type(() => VolunteeringSectionDto)
    readonly volunteeringSection: VolunteeringSectionDto;
}

export class OrganizationDto {
    @IsNotEmpty()
    @IsString()
    readonly firstName: string;

    @IsNotEmpty()
    @IsString()
    readonly lastName: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    readonly password: string;

    readonly role: string;

    readonly isActive: boolean;

    @Type(() => LiveStreamingDto)
    readonly liveStreaming: LiveStreamingDto;

    @ValidateNested()
    @Type(() => OrganizationDetailDto)
    readonly organizationDetail: OrganizationDetailDto;

  
}
