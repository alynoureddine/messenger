import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SocketSession } from './socket-session.schema';

@Injectable()
export class SocketSessionService {
  constructor(@InjectModel(SocketSession.name) private socketSessionModel: Model<SocketSession>) {

  }

  public findSessionByUserId(userId: number): Promise<SocketSession> {
    return this.socketSessionModel.findOne({ userId }).exec();
  }

  public createOrUpdateSession(userId: number, socketId: string): Promise<SocketSession> {
    return this.socketSessionModel.findOneAndUpdate(
      { userId },
      { socketId, userId, lastSeen: new Date() },
      { new: true, upsert: true},
    ).exec()
  }
}
