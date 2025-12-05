import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './schema/chat.schema';
import { Model, Types } from 'mongoose';
import { CreateChatDto } from './schema/dto/createChat.dto';
import { SendMessageDto } from 'src/chat/schema/dto/sendMessage.dto';

@Injectable()
export class ChatService {
    constructor(@InjectModel(Chat.name) private readonly chatModel: Model<Chat>) { }
    

    async createChat(dto: CreateChatDto): Promise<Chat>
    {
        const newChat = new this.chatModel({
            participants: dto.participants,
            messages: [],
        });
        return newChat.save();
    }



    async getChats(userId: string): Promise<Chat[]> {
        return this.chatModel.find({ participants: userId }).populate('participants', 'username').exec();
    }


    async getChatDetails(chatId: string): Promise<Chat> {
        if (!chatId) {
            throw new BadRequestException('Chat ID is required');
        }

        const chat = await this.chatModel
            .findById(chatId)
            .populate('participants', 'username')
            .populate('messages.sender', 'username')
            .exec();

        if (!chat) {
            throw new NotFoundException('Chat not found');
        }

        return chat;
    }



    async sendMessage(
        chatId: string,
        userId: string,
        sendMessageDto: SendMessageDto,
    ): Promise<Chat> {
        const chat = await this.chatModel.findById(chatId);
        if (!chat) {
            throw new NotFoundException('Chat not found');
        }

        chat.messages.push({
            sender: new Types.ObjectId(userId),
            content: sendMessageDto.content,
            timestamp: new Date(),
        });

        return chat.save();
    }





}
