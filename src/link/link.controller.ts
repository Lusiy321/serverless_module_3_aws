import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { LinkService } from './link.service';
import { CreateLinkDto } from './dto/create.link.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Link')
@Controller('links')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @ApiOperation({ summary: 'Createnew link' })
  @ApiResponse({ status: 201, type: String })
  @ApiBearerAuth('BearerAuthMethod')
  @Post('create')
  async createLink(@Body() createLinkDto: CreateLinkDto, @Req() req: any) {
    const link = await this.linkService.createLink(createLinkDto, req);
    return link;
  }
  @ApiOperation({ summary: 'Deactivate link' })
  @ApiResponse({ status: 200, type: String })
  @ApiBearerAuth('BearerAuthMethod')
  @Put('deactivate/:linkId')
  async deactivateLink(@Param('linkId') linkId: string, @Req() req: any) {
    const deactivatedLink = await this.linkService.deactivateLink(linkId, req);
    return deactivatedLink;
  }

  @ApiOperation({ summary: 'Redirect to link' })
  @ApiResponse({ status: 200, type: String })
  @Get(':linkId')
  async redirect(@Param('linkId') linkId: string, @Res() res: any) {
    const originUrl = await this.linkService.redirectLink(linkId);

    return await res.redirect(302, originUrl);
  }

  @ApiOperation({ summary: 'Link stats' })
  @ApiResponse({ status: 200, type: String })
  @Get('stats/:linkId')
  async getLinkStats(@Param('linkId') linkId: string) {
    const visitCount = await this.linkService.getLinkStats(linkId);
    return { visits: visitCount };
  }

  @ApiOperation({ summary: 'Get user links' })
  @ApiResponse({ status: 200, type: String })
  @ApiBearerAuth('BearerAuthMethod')
  @Get('/')
  async listUserLinks(@Req() req: any) {
    const userLinks = await this.linkService.listUserLinks(req);
    return userLinks;
  }
}
