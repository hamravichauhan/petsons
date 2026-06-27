import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Verify JWT with Clerk's public key
      const response = await fetch('https://api.clerk.com/v1/tokens/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.configService.get('CLERK_SECRET_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new UnauthorizedException('Invalid token');
      }

      const data = await response.json();
      
      // Attach user info to request
      request.user = {
        userId: data.user_id,
        email: data.email_address,
        organizationId: data.public_metadata?.organizationId,
        tier: data.public_metadata?.tier || 'PENDING',
        role: data.public_metadata?.role || 'BUYER',
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}