import { Injectable } from '@nestjs/common';
import { Link } from './link.schema';
import { CreateLinkDto } from './dto/create.link.dto';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { AuthService } from 'src/auth/auth.service';
import { Unauthorized, NotFound, Conflict, BadRequest } from 'http-errors';

@Injectable()
export class LinkService {
  private readonly dynamoDbClient: DocumentClient;
  constructor(private readonly authService: AuthService) {
    this.dynamoDbClient = new DocumentClient({
      region: process.env.REGION,
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    });
  }

  async createLink(data: CreateLinkDto, req: any): Promise<Link> {
    try {
      const { originalUrl, lifetime } = data;
      const user = await this.authService.findToken(req);

      if (!user) {
        throw new Unauthorized('jwt expired');
      }
      const validate = this.isValidUrl(originalUrl);
      if (validate === true) {
        const expiresAt = lifetime
          ? new Date(Date.now() + lifetime * 24 * 60 * 60 * 1000)
          : null;

        const genId = this.generateShortUrl();
        const shortUrl = process.env.DOMIAN_NAME + genId;
        const link: Link = {
          id: genId.toString(),
          originalUrl: originalUrl,
          shortUrl: shortUrl,
          email: user.email,
          isActive: true,
          expiresAt: expiresAt.toString(),
          visitCount: 0,
        };
        const params = {
          TableName: 'Link',
          Item: link,
        };

        await this.dynamoDbClient.put(params).promise();
        return link;
      } else {
        return null;
      }
    } catch (e) {
      throw new Unauthorized('jwt expired');
    }
  }

  async deactivateLink(id: string, req: any): Promise<object> {
    try {
      const user = await this.authService.findToken(req);

      if (user) {
        const params = {
          TableName: 'Link',
          Key: { id },
        };

        const findLink = await this.dynamoDbClient.get(params).promise();

        if (findLink.Item.email === user.email) {
          if (findLink.Item.isActive === true) {
            findLink.Item.isActive = false;
            const param = {
              TableName: 'Link',
              Item: findLink.Item,
            };

            await this.dynamoDbClient.put(param).promise();
            const findNew = await this.dynamoDbClient.get(params).promise();
            return findNew.Item;
          } else if (findLink.Item.isActive === false) {
            throw new Conflict('Link is deactivated');
          } else {
            throw new NotFound('Link not found');
          }
        }
      } else {
        throw new Unauthorized('jwt expired');
      }
    } catch (e) {
      throw new BadRequest(e);
    }
  }

  async redirectLink(id: string) {
    const params = {
      TableName: 'Link',
      Key: { id },
    };

    const link = await this.dynamoDbClient.get(params).promise();
    if (link.Item.isActive === true) {
      const dateLink = new Date(link.Item.expiresAt);
      const dateNow = new Date();
      if (dateNow > dateLink || link.Item.expiresAt === null) {
        link.Item.isActive = false;
        link.Item.visitCount = 1;
        const param = {
          TableName: 'Link',
          Item: link.Item,
        };

        await this.dynamoDbClient.put(param).promise();
        return link.Item.originalUrl;
      } else {
        link.Item.visitCount = link.Item.visitCount + 1;
        const par = {
          TableName: 'Link',
          Item: link.Item,
        };
        await this.dynamoDbClient.put(par).promise();
        return link.Item.originalUrl;
      }
    } else {
      throw new Conflict('Link is deactivated');
    }
  }

  async getLinkStats(id: string): Promise<number> {
    const params = {
      TableName: 'Link',
      Key: { id },
    };

    const link = await this.dynamoDbClient.get(params).promise();
    return link.Item.visitCount;
  }

  async listUserLinks(req: any): Promise<any> {
    const params = {
      TableName: 'Link',
    };
    const user = await this.authService.findToken(req);
    const allLinks = await this.dynamoDbClient.scan(params).promise();
    const arr: any = allLinks.Items;
    console.log(arr);
    const links = Array.isArray(arr)
      ? arr.filter((obj) => obj.email === user.email)
      : [];

    return links.map((link) => ({
      shortUrl: link.shortUrl,
      originalUrl: link.originalUrl,
      visitCount: link.visitCount,
      expiresAt: link.expiresAt,
    }));
  }

  private generateShortUrl() {
    const min = 10000000;
    const max = 99999999;
    const genId = Math.floor(Math.random() * (max - min + 1)) + min;

    return genId;
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
