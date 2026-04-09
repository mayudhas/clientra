import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    // Custom error handling if needed
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication invalid or missing token');
    }
    return user;
  }
}
