/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class User {
  id: string;
  @ApiProperty({ example: 'zelenskiy@gmail.com', description: 'User email' })
  @IsEmail()
  email: string;
  @ApiProperty({ example: 'Vovan-123545', description: 'User password' })
  @IsString()
  password: string;
  accessToken: string;
  refreshToken: string;
}
