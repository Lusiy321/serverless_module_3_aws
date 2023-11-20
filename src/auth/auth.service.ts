import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';
import { Conflict, NotFound } from 'http-errors';
import { compareSync } from 'bcryptjs';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly dynamoDbClient: DocumentClient;
  private readonly tableName: string;
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    this.dynamoDbClient = new DocumentClient({
      region: process.env.REGION,
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    });

    this.tableName = this.configService.get<string>('Users');
  }

  async login(email: string, password: string): Promise<string | null> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new NotFound('Email is wrong');
    }

    const isPasswordValid = compareSync(password, user.password);

    if (!isPasswordValid) {
      throw new Conflict('Password is wrong');
    }

    const payload = {
      email: user.email,
    };
    const SECRET_KEY = process.env.SECRET_KEY;
    const accessToken = sign(payload, SECRET_KEY, { expiresIn: '60m' });
    user.accessToken = accessToken;
    const params = {
      TableName: 'Users',
      Item: user,
    };

    await this.dynamoDbClient.put(params).promise();

    return accessToken;
  }
}
