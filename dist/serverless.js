"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.start = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = __importDefault(require("express"));
const serverless_express_1 = __importDefault(require("@vendia/serverless-express"));
let server;
async function start() {
    const PORT = 5000;
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter((0, express_1.default)()), {
        cors: true,
    });
    app.enableCors();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Event and Show server')
        .setDescription('REAST API Documentation')
        .setVersion('1.0.0')
        .addBearerAuth({
        description: 'JWT Authorization',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
    }, 'BearerAuthMethod')
        .addServer(`http://localhost:${PORT}`)
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    await app.init();
    const expressApp = app.getHttpAdapter().getInstance();
    return (0, serverless_express_1.default)({ app: expressApp });
}
exports.start = start;
const handler = async (event, context, callback) => {
    server = server !== null && server !== void 0 ? server : (await start());
    return server(event, context, callback);
};
exports.handler = handler;
//# sourceMappingURL=serverless.js.map