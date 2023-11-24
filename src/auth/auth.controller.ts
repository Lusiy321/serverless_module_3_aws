import { Body, Controller, HttpCode, Patch, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginUserDto } from 'src/user/dto/create.user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({ status: 200, type: String })
  @HttpCode(200)
  @Post('login')
  async login(@Body() body: LoginUserDto) {
    const token = await this.authService.login(body);
    return { token };
  }
  @ApiOperation({ summary: 'Logout User' })
  @ApiResponse({ status: 200, type: String })
  @ApiBearerAuth('BearerAuthMethod')
  @HttpCode(200)
  @Post('logout')
  async logout(@Req() request: any) {
    return await this.authService.logout(request);
  }

  @ApiOperation({ summary: 'Refresh Access Token' })
  @ApiBearerAuth('BearerAuthMethod')
  @Patch('refresh')
  async refresh(@Req() request: any) {
    return await this.authService.refreshAccessToken(request);
  }
}
