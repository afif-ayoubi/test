import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class OrganizationLocation {
    @Prop()
    latitude?: number;
    @Prop()
    longitude?: number;
}
export const OrganizationLocationSchema = SchemaFactory.createForClass(OrganizationLocation);