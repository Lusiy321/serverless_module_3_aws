import { Injectable } from '@nestjs/common';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';
import { Conflict, NotFound, BadRequest, Unauthorized } from 'http-errors';
import { compareSync } from 'bcryptjs';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { User } from 'src/user/user.model';
import { LoginUserDto } from 'src/user/dto/create.user.dto';
import { Lambda } from 'aws-sdk';

@Injectable()
export class AuthService {
  private readonly dynamoDbClient: DocumentClient;
  private readonly lambda: Lambda;

  constructor(private readonly userService: UserService) {
    this.dynamoDbClient = new DocumentClient({
      region: process.env.REGION,
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    });
    this.lambda = new Lambda({
      region: process.env.REGION,
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    });
  }

  async login(body: LoginUserDto): Promise<string | null> {
    const { email, password } = body;
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

  async authorize(token: string, methodArn: string): Promise<any> {
    const result = await this.lambda
      .invoke({
        FunctionName: 'serverless-module-3-aws-dev-main',
        Payload: JSON.stringify({
          authorizationToken: `Bearer ${token}`,
          methodArn,
        }),
      })
      .promise();

    return JSON.parse(result.Payload?.toString());
  }

  async logout(req: any): Promise<object> {
    const user = await this.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      user.accessToken = null;
      const params = {
        TableName: 'Users',
        Item: user,
      };

      await this.dynamoDbClient.put(params).promise();
      return { token: user.accessToken };
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async findToken(req: any): Promise<User> {
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization.split(' ');

      if (bearer !== 'Bearer') {
        throw new Unauthorized('Not authorized');
      }

      const SECRET_KEY = process.env.SECRET_KEY;
      const findEmail = verify(token, SECRET_KEY) as JwtPayload;
      const { email } = findEmail;
      const user = await this.userService.getUserByEmail(email);
      if (user) {
        return user;
      } else {
        throw new Unauthorized('jwt expired');
      }
    } catch (e) {
      throw new Unauthorized('jwt expired');
    }
  }

  async refreshAccessToken(req: any): Promise<object> {
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization.split(' ');

      if (bearer !== 'Bearer') {
        throw new Unauthorized('Not authorized');
      }
      console.log(token);
      const SECRET_KEY = process.env.SECRET_KEY;
      const findEmail = verify(token, SECRET_KEY) as JwtPayload;
      const { email } = findEmail;

      const user = await this.userService.getUserByEmail(email);

      if (!user) {
        throw new NotFound('User not found');
      }
      const payload = {
        email: email,
      };
      const tokenRef = sign(payload, SECRET_KEY);
      user.accessToken = tokenRef;
      const params = {
        TableName: 'Users',
        Item: user,
      };

      await this.dynamoDbClient.put(params).promise();

      return { token: tokenRef };
    } catch (error) {
      throw new BadRequest('Invalid refresh token');
    }
  }
}
