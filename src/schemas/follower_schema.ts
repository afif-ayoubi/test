import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Follower{
    @Prop({ required: true })
    organizationId: String;
}
export const FollowerSchema = SchemaFactory.createForClass(Follower);
