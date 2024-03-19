import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { verify } from 'jsonwebtoken';

@Injectable()
export class WsJwtGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.handshake.headers.authorization;

    // const client = context.switchToWs().getClient();
    // const authHeader = client.handshake.headers.authorization;

    if (!authHeader) throw new WsException('Немає токену доступу');

    const token = authHeader.split(' ')[1];
    try {
      const decoded = verify(token, 'topsecretket');

      if (typeof decoded === 'object' && 'id' in decoded) {
        request.user = { email: decoded.email, id: decoded.id };
        return !!decoded;
      } else {
        throw new WsException('Invalid token');
      }
    } catch (err) {
      throw new WsException(err);
    }
  }
}
