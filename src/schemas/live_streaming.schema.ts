import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

export class LiveStreaming {
    @Prop({ required: true,})
    liveStremingId: string;
    @Prop({ required: true,})
    isActivated: boolean;
}
export const LiveStreamingSchema = SchemaFactory.createForClass(LiveStreaming);