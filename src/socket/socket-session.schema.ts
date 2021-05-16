import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exclude } from 'class-transformer';

@Schema()
export class SocketSession extends Document {

  @Exclude()
  @Prop()
  socketId: string;

  @Exclude()
  @Prop()
  userId: number;

  @Prop()
  lastSeen: Date;

  // @Prop()
  // isConnected: boolean;
}

export const SocketSessionSchema = SchemaFactory.createForClass(SocketSession);
