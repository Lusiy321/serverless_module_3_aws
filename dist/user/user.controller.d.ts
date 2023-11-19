import { UserService } from './user.service';
import { User } from './user.model';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUserByEmail(email: string): Promise<User | null>;
    createUser(user: User): Promise<void>;
}
