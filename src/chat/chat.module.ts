import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schema/chat.schema';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[MongooseModule.forFeature([{name:Chat.name,schema:ChatSchema}]),AuthModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
