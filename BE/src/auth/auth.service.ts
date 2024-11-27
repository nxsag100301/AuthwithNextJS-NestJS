
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { comparePasswordHelper, hashPasswordHelper } from '@/helpers/util';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto, RetryPasswordDto, VerifyAuthDto } from './dto/create-auth.dto';
import dayjs from 'dayjs';
import { EmailService } from '@/mail/emailService';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if (!user) return null
    const isValidPassword = await comparePasswordHelper(pass, user.password)
    if (!isValidPassword) return null
    return user
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user._id };
    return {
      user: {
        _id: user._id,
        email: user.email,
        name: user.name

      },
      access_token: this.jwtService.sign(payload)
    };
  }

  async handleRegister(registerDto: CreateAuthDto) {
    return await this.usersService.handleRegister(registerDto)
  }

  async verifyAccount(verifyDto: VerifyAuthDto) {
    const user = await this.usersService.findVerify(verifyDto.id, verifyDto.code);
    if (!user) {
      throw new BadRequestException("Invalid code")

    }
    else {
      const isBeforeCheck = dayjs().isBefore(user.codeExpired)
      if (!isBeforeCheck) {
        throw new BadRequestException("Code expired")
      }
      else {
        await this.usersService.updateVerify({ _id: verifyDto.id, isActive: true, });
        return {
          message: "Account activated"
        }
      }
    }
  }

  async resendCodeActive(email: string) {
    let updateCodeId = await this.usersService.updateCodeId(email)
    if (!updateCodeId) {
      throw new BadRequestException("Not found user")
    }
    else {
      let res = await this.usersService.findByEmail(email)
      this.emailService.sendEmail({ email: res.email, name: res.name, codeId: res.codeId })
      return {
        id: res._id,
        email: res.email,
      }
    }
  }

  async retryPassword(retryPassDto: RetryPasswordDto) {
    let res = await this.usersService.updatePassword(retryPassDto)
    if (!res) {
      throw new BadRequestException("Invalid code")
    }
    else {
      return {
        message: "Update password success"
      }
    }
  }
}


