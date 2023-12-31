/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './user/user.service';
import { AuthController } from './auth/auth.controller';
import { LinkModule } from './link/link.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    UserModule,
    AuthModule,
    LinkModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AppModule {}
