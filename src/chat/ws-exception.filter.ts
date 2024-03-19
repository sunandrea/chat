import { ArgumentsHost, Catch, WsExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch()
export class WebsocketExceptionFilter implements WsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    console.log(`exception: ${exception.message}`);
    const socket = host.switchToWs().getClient();
    socket.emit('exception', {
      status: 'error',
      message: exception.message,
    });
  }
}
