import { Get, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  @Get('users')
  async getAllUsers() {
    return this.prisma.user.findMany();
  }
}
