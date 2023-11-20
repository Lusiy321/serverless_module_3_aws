"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const dynamodb_1 = require("aws-sdk/clients/dynamodb");
const config_1 = require("@nestjs/config");
const uuid_1 = require("uuid");
const bcryptjs_1 = require("bcryptjs");
const http_errors_1 = require("http-errors");
const jsonwebtoken_1 = require("jsonwebtoken");
let UserService = class UserService {
    constructor(configService) {
        this.configService = configService;
        this.dynamoDbClient = new dynamodb_1.DocumentClient({
            region: process.env.REGION,
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
        });
    }
    async hashPassword(password) {
        const saltRounds = 10;
        const hashedPassword = (0, bcryptjs_1.hashSync)(password, saltRounds);
        return hashedPassword;
    }
    async createUser(user) {
        try {
            const userExist = await this.getUserByEmail(user.email);
            console.log(userExist);
            if (!userExist) {
                const payload = {
                    email: user.email,
                };
                const SECRET_KEY = process.env.SECRET_KEY;
                const accessToken = (0, jsonwebtoken_1.sign)(payload, SECRET_KEY, { expiresIn: '60m' });
                const refreshToken = (0, jsonwebtoken_1.sign)(payload, SECRET_KEY);
                const hashPsw = await this.hashPassword(user.password);
                user.password = hashPsw;
                user.accessToken = accessToken;
                user.refreshToken = refreshToken;
                user.id = (0, uuid_1.v4)();
                const params = {
                    TableName: 'Users',
                    Item: user,
                };
                await this.dynamoDbClient.put(params).promise();
                return { token: user.accessToken };
            }
            else {
                throw new http_errors_1.NotFound('User exist');
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('User exist');
        }
    }
    async getUserByEmail(email) {
        const params = {
            TableName: 'Users',
            Key: { email },
        };
        try {
            const result = await this.dynamoDbClient.get(params).promise();
            return result.Item;
        }
        catch (error) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
    async refreshAccessToken(req) {
        try {
            const { authorization = '' } = req.headers;
            const [bearer, token] = authorization.split(' ');
            if (bearer !== 'Bearer') {
                throw new http_errors_1.Unauthorized('Not authorized');
            }
            const SECRET_KEY = process.env.SECRET_KEY;
            const findEmail = (0, jsonwebtoken_1.verify)(token, SECRET_KEY);
            const email = findEmail;
            const user = await this.getUserByEmail(email);
            if (!user) {
                throw new http_errors_1.NotFound('User not found');
            }
            const payload = {
                email: findEmail,
            };
            const tokenRef = (0, jsonwebtoken_1.sign)(payload, SECRET_KEY);
            user.accessToken = tokenRef;
            const params = {
                TableName: 'Users',
                Item: user,
            };
            await this.dynamoDbClient.put(params).promise();
            return tokenRef;
        }
        catch (error) {
            throw new http_errors_1.BadRequest('Invalid refresh token');
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UserService);
//# sourceMappingURL=user.service.js.map