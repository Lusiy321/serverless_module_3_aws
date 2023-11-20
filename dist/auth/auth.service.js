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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jsonwebtoken_1 = require("jsonwebtoken");
const user_service_1 = require("../user/user.service");
const http_errors_1 = require("http-errors");
const bcryptjs_1 = require("bcryptjs");
const dynamodb_1 = require("aws-sdk/clients/dynamodb");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(userService, configService) {
        this.userService = userService;
        this.configService = configService;
        this.dynamoDbClient = new dynamodb_1.DocumentClient({
            region: process.env.REGION,
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
        });
        this.tableName = this.configService.get('Users');
    }
    async login(email, password) {
        const user = await this.userService.getUserByEmail(email);
        if (!user) {
            throw new http_errors_1.NotFound('Email is wrong');
        }
        const isPasswordValid = (0, bcryptjs_1.compareSync)(password, user.password);
        if (!isPasswordValid) {
            throw new http_errors_1.Conflict('Password is wrong');
        }
        const payload = {
            email: user.email,
        };
        const SECRET_KEY = process.env.SECRET_KEY;
        const accessToken = (0, jsonwebtoken_1.sign)(payload, SECRET_KEY, { expiresIn: '60m' });
        user.accessToken = accessToken;
        const params = {
            TableName: 'Users',
            Item: user,
        };
        await this.dynamoDbClient.put(params).promise();
        return accessToken;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map