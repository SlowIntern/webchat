import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server,Socket } from 'socket.io';
import { SendMessageDto } from './schema/dto/sendMessage.dto';


@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    
    @WebSocketServer() server: Server;

    constructor(private readonly chatService: ChatService) { }
    
    afterInit(server: Server) {
        console.log('Websocket Server initialized');
    }

    handleConnection(client:Socket) {
        console.log("Client connected",client.id);
    }

    handleDisconnect(client: Socket) {
        console.log("Client disconnected",client.id);
    }


    @SubscribeMessage('sendMessage')
    async handleMessage(client: Socket, payload: { chatId: string; userId: string; content: string }) {
        const message: SendMessageDto = { content: payload.content };
        const chat = await this.chatService.sendMessage(payload.chatId, payload.userId, message);
        this.server.to(payload.chatId).emit('receiveMessage', chat);
    }   

    @SubscribeMessage('joinChat')
    handleJoinChat(client: Socket, chatId: string) {
        client.join(chatId);
        console.log(`Client ${client.id} joined chat ${chatId}`);
    }
  
}
