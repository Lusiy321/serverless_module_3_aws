/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { User } from './user.model';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { hashSync } from 'bcryptjs';
import { NotFound } from 'http-errors';
import { JwtPayload, sign } from 'jsonwebtoken';

@Injectable()
export class UserService {
  private readonly dynamoDbClient: DocumentClient;
  constructor(private readonly configService: ConfigService) {
    this.dynamoDbClient = new DocumentClient({
      region: process.env.REGION,
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    });
  }
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = hashSync(password, saltRounds);
    return hashedPassword;
  }

  async createUser(user: User): Promise<object> {
    try {
      const userExist = await this.getUserByEmail(user.email);
      console.log(userExist);
      if (!userExist) {
        const payload = {
          email: user.email,
        };
        const SECRET_KEY = process.env.SECRET_KEY;
        const accessToken = sign(payload, SECRET_KEY, { expiresIn: '60m' });
        const refreshToken = sign(payload, SECRET_KEY);
        const hashPsw = await this.hashPassword(user.password);
        user.password = hashPsw;
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        user.id = uuidv4();
        const params = {
          TableName: 'Users',
          Item: user,
        };

        await this.dynamoDbClient.put(params).promise();
        return { token: user.accessToken };
      } else {
        throw new NotFound('User exist');
      }
    } catch (e) {
      throw new NotFound('User exist');
    }
  }

  async getUserByEmail(email: string | JwtPayload): Promise<User | null> {
    const params = {
      TableName: 'Users',
      Key: { email },
    };

    try {
      const result = await this.dynamoDbClient.get(params).promise();
      if (Object.keys(result).length === 0) {
        throw new Error('User not found');
      } else {
        return result.Item as User;
      }
    } catch (error) {
      throw new NotFound('User not found');
    }
  }
}
