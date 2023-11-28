import { Module } from '@nestjs/common';
import { LinkService } from './link.service';
import { LinkController } from './link.controller';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { SqsService } from './utils/aws.config.sqs';
import { SendGridService } from './utils/sendGrid.service';

@Module({
  imports: [],
  providers: [
    LinkService,
    AuthService,
    UserService,
    SqsService,
    SendGridService,
  ],
  controllers: [LinkController],
})
export class LinkModule {}
