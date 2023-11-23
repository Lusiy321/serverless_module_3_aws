import { Injectable } from '@nestjs/common';

import { Link } from './link.schema';
import { CreateLinkDto } from './dto/create.link.dto';

@Injectable()
export class LinkService {
  constructor() {}

  // async createLink(data: CreateLinkDto): Promise<Link> {
  //   try {
  //     const { email, originalUrl, lifetime } = data;
  //     const validate = this.isValidUrl(originalUrl);
  //     if (validate === true) {
  //       const expiresAt = lifetime
  //         ? new Date(Date.now() + lifetime * 24 * 60 * 60 * 1000)
  //         : null;
  //       const shortUrl = this.generateShortUrl();
  //       // const link = new this.linkModel({
  //       //   originalUrl,
  //       //   shortUrl,
  //       //   email,
  //       //   expiresAt,
  //       // });
  //       return link.save();
  //     } else {
  //       return null;
  //     }
  //   } catch (e) {
  //     return e;
  //   }
  // }

  // async deactivateLink(linkId: string): Promise<Link> {
  //   return this.linkModel.findByIdAndUpdate(linkId, { isActive: false });
  // }

  // async getLinkStats(linkId: string): Promise<number> {
  //   const link = await this.linkModel.findById(linkId);
  //   return link ? link.visitCount : 0;
  // }

  // async listUserLinks(
  //   userId: string,
  // ): Promise<{ shortUrl: string; visitCount: number }[]> {
  //   const links = await this.linkModel.find({ userId });
  //   return links.map((link) => ({
  //     shortUrl: link.shortUrl,
  //     visitCount: link.visitCount,
  //   }));
  // }

  private generateShortUrl() {
    // const genId = nanoid.customAlphabet(
    //   '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    //   8,
    // );
    const shortUrl = process.env.DOMIAN_NAME;

    return shortUrl;
  }

  private isValidUrl(url: string) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }
}
