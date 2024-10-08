import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      console.log('No token found');
      throw new UnauthorizedException();
    }

    try {
      const user = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET')
      });
      console.log('Verified User:', user);
      request['user'] = user;
    } catch (err) {
      console.error('JWT Verification Error:', err);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      console.log('Authorization header is missing');
      return undefined;
    }

    console.log('Authorization header received:', authorizationHeader);
    const [type, token] = authorizationHeader.split(' ');
    if (type !== 'Bearer') {
      console.log('Authorization type is not Bearer:', type);
    }
    return type === 'Bearer' ? token : undefined;
  }
}