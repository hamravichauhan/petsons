import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body()
    body: {
      legalName: string;
      taxIdentifier: string;
      taxIdentifierType: string;
      businessType: string;
      email: string;
      password: string;
      phone: string;
      firstName: string;
      lastName: string;
    },
  ) {
    return this.authService.register(body);
  }
}