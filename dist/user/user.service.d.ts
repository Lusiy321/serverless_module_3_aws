import { User } from './user.model';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'jsonwebtoken';
export declare class UserService {
    private readonly configService;
    private readonly dynamoDbClient;
    private readonly tableName;
    constructor(configService: ConfigService);
    hashPassword(password: string): Promise<string>;
    createUser(user: User): Promise<object>;
    getUserByEmail(email: string | JwtPayload): Promise<User | null>;
    refreshAccessToken(req: any): Promise<string>;
}
