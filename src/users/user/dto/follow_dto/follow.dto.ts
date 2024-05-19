import { IsNotEmpty } from "class-validator";

export class FollowDto {
    @IsNotEmpty()
    organizationId: string;
}
