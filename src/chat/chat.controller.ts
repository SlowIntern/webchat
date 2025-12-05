import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './schema/dto/createChat.dto';
import { Chat } from './schema/chat.schema';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { SendMessageDto } from './schema/dto/sendMessage.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }
  


   @Post('createChat')
    async createChat(@Body() Dto: CreateChatDto): Promise<Chat> {
      console.log(Dto);
      return this.chatService.createChat(Dto);
   }
  
  
  @UseGuards(AuthGuard)
  @Get()
  async getChats(@Request() req): Promise<Chat[]> {
    return this.chatService.getChats(req.user.userId);
  }


  @UseGuards(AuthGuard)
  @Get(':chatId')
  async getChatDetails(@Param('chatId') chatId: string): Promise<Chat> {
    return this.chatService.getChatDetails(chatId);
  }


  @UseGuards(AuthGuard)
  @Post(':chatId/messages')
  async sendMessage(@Param('chatId') chatId: string, @Request() req, @Body() sendMessageDto: SendMessageDto): Promise<Chat> {
    return this.chatService.sendMessage(chatId, req.user.userId, sendMessageDto);
  }


}
