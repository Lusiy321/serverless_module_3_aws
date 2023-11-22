import { Module } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Module({
  providers: [
    {
      provide: 'DynamoDB',
      useFactory: () => {
        return new AWS.DynamoDB.DocumentClient({
          region: process.env.REGION,
          accessKeyId: process.env.ACCESS_KEY_ID,
          secretAccessKey: process.env.SECRET_ACCESS_KEY,
        });
      },
    },
  ],
  exports: ['DynamoDB'],
})
export class DynamoDBModule {}
