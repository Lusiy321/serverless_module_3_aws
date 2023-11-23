import { Controller, Post, Body, Put, Param, Get } from '@nestjs/common';
import { LinkService } from './link.service';
import { CreateLinkDto } from './dto/create.link.dto';

@Controller('links')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  // @Post('create')
  // async createLink(@Body() createLinkDto: CreateLinkDto) {
  //   const link = await this.linkService.createLink(createLinkDto);
  //   return link;
  // }

  // @Put('deactivate/:linkId')
  // async deactivateLink(@Param('linkId') linkId: string) {
  //   const deactivatedLink = await this.linkService.deactivateLink(linkId);
  //   return deactivatedLink;
  // }

  // @Get('stats/:linkId')
  // async getLinkStats(@Param('linkId') linkId: string) {
  //   const visitCount = await this.linkService.getLinkStats(linkId);
  //   return { visitCount };
  // }

  // @Get('list/:userId')
  // async listUserLinks(@Param('userId') userId: string) {
  //   const userLinks = await this.linkService.listUserLinks(userId);
  //   return userLinks;
  // }
}
