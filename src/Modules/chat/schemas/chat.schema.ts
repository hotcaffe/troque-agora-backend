import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Chat {
    @Prop({required: true})
    user_id: string;

    @Prop({required: true})
    recipient_id: string;

    @Prop({required: true})
    message: string;

    @Prop({required: true, default: Date.now()})
    timestamp: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat)