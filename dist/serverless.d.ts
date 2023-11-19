import { Handler } from 'aws-lambda';
export declare function start(): Promise<Handler<any, any> & import("@vendia/serverless-express/src/configure").ConfigureResult<any, any>>;
export declare const handler: Handler;
