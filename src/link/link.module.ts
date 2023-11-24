import { Module } from '@nestjs/common';
import { LinkService } from './link.service';
import { LinkController } from './link.controller';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [],
  providers: [LinkService, AuthService, UserService],
  controllers: [LinkController],
})
export class LinkModule {}
