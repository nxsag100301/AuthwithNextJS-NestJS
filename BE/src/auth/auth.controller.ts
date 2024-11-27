import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public, ResponseMessage } from '@/decorator/customize';
import { CreateAuthDto, RetryPasswordDto, VerifyAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @UseGuards(LocalAuthGuard)
  @Public()
  @ResponseMessage("Fetch login")
  @Post('login')
  async handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('register')
  @Public()
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto)
  }

  @Post('verify-account')
  @Public()
  verifyAccount(@Body() vefifyDto: VerifyAuthDto) {
    return this.authService.verifyAccount(vefifyDto)
  }

  @Post('retry-active')
  @Public()
  resendCodeActive(@Body("email") email: string) {
    return this.authService.resendCodeActive(email)
  }

  @Post('retry-password')
  @Public()
  retryPassword(@Body() retryPassDto: RetryPasswordDto) {
    return this.authService.retryPassword(retryPassDto)
  }



}
