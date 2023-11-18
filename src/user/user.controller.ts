import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.model';
import { ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get User by email' })
  @ApiResponse({ status: 200, type: String })
  @Get(':email')
  async getUserByEmail(@Param('email') email: string): Promise<User | null> {
    return this.userService.getUserByEmail(email);
  }

  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({ status: 201, type: String })
  @Post('/')
  async createUser(@Body() user: User): Promise<void> {
    await this.userService.createUser(user);
  }
}
