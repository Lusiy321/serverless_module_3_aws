import { Module } from '@nestjs/common';
import { LinkService } from './link.service';
import { LinkController } from './link.controller';
import { Link, LinkSchema } from './link.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { DynamoDBModule } from 'src/dinamo-db/dinamo-db.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Link.name, schema: LinkSchema }]),
    DynamoDBModule,
  ],
  providers: [LinkService],
  controllers: [LinkController],
})
export class LinkModule {}
