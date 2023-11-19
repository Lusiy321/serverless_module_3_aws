import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly userService;
    private readonly configService;
    private readonly dynamoDbClient;
    private readonly tableName;
    constructor(userService: UserService, configService: ConfigService);
    login(email: string, password: string): Promise<string | null>;
}
