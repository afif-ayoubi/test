import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class VolunteeringSection {
    @Prop({ required: true })
    name: string;
    @Prop({ required: true })
    description: string;
    @Prop({ required: true })
    imageUrl: string;

}
export const VolunteeringSectionSchema = SchemaFactory.createForClass(VolunteeringSection);