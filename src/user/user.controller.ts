import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'generated/prisma/client';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('users')
    getAllUsers(): Promise<User[]> {
        return this.userService.getAllUsers();
    }
}
