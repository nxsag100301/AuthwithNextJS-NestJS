import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateVerifyUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { hashPasswordHelper } from '@/helpers/util';
import aqp from 'api-query-params';
import { CreateAuthDto, RetryPasswordDto } from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid'
import { EmailService } from '@/mail/emailService';
const dayjs = require('dayjs');

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private emailService: EmailService) { }

  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email: email })
    if (user) {
      return true
    }
    else {
      return false
    }
  }
  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone, address, image } = createUserDto
    const isExist = await this.isEmailExist(email)
    if (isExist) {
      throw new BadRequestException("This email already exist")
    }
    //hash password
    const hassPassword = await hashPasswordHelper(password)
    const user = await this.userModel.create({
      name: name,
      email: email,
      password: hassPassword,
      phone: phone,
      address: address,
      image: image,
    })
    const userEmail = user.email
    return ({
      email: userEmail,
      message: 'This action adds a new user'
    });
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query)
    if (filter.current) delete filter.current
    if (filter.pageSize) delete filter.pageSize
    if (!current) current = 1
    if (!pageSize) pageSize = 10
    const totalItems = (await this.userModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / pageSize)
    const skip = (current - 1) * (pageSize)
    const results = await this.userModel.find(filter).limit(pageSize).skip(skip).select("-password").sort(sort as any)
    return { results, totalPages, totalItems, current };
  }

  async findOne(id: string) {
    return await this.userModel.findOne({ _id: id })
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email })
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        name: updateUserDto.name,
        phone: updateUserDto.phone,
        address: updateUserDto.address,
        image: updateUserDto.image,
        isActive: updateUserDto.isActive
      }
    );
  }
  async updateVerify(updateVerifyUserDto: UpdateVerifyUserDto) {
    return await this.userModel.updateOne(
      { _id: updateVerifyUserDto._id },
      {
        isActive: updateVerifyUserDto.isActive
      }
    );
  }

  async updateCodeId(email: string) {
    let res = await this.findByEmail(email)
    if (!res) {
      throw new BadRequestException("Not found user")
    }
    else {
      return await this.userModel.updateOne(
        { email: email },
        {
          codeId: uuidv4(),
          codeExpired: dayjs().add(5, 'minutes')
        }
      )
    }
  }

  async updatePassword(retryPassDto: RetryPasswordDto) {
    const res = await this.findVerify(retryPassDto.id, retryPassDto.code);
    if (!res) {
      throw new BadRequestException("Invalid code")
    }
    else {
      const hassPassword = await hashPasswordHelper(retryPassDto.password)
      let changed = await this.userModel.updateOne(
        { _id: retryPassDto.id },
        {
          password: hassPassword
        }
      )
      return res
    }
  }

  async remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      const isExist = await this.userModel.exists({ _id })
      if (isExist) {
        return this.userModel.deleteOne({ _id })
      }
      else {
        throw new BadRequestException("User does not exist")
      }
    }
    else {
      throw new BadRequestException("Invalid id")
    }

  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { name, email, password, phone, address } = registerDto
    const isExist = await this.isEmailExist(email)
    if (isExist) {
      throw new BadRequestException("This email already exist")
    }
    //hash password
    const hassPassword = await hashPasswordHelper(password)
    const register = await this.userModel.create({
      email: email,
      password: hassPassword,
      name: name,
      phone: phone,
      address: address,
      isActive: false,
      codeId: uuidv4(),
      codeExpired: dayjs().add(5, 'minutes')
    })
    //send email active
    const dataMail = { email: register.email, name: register.name, codeId: register.codeId }
    this.emailService.sendEmail(dataMail)
    return {
      _id: register._id,
      email: register.email,
      message: "Register success"
    }
  }

  async findVerify(id: string, code: string) {
    const user = await this.userModel.findOne({ _id: id, codeId: code })
    return user
  }
}
