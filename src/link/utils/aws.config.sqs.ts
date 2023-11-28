/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class SqsService {
  public readonly sqs: AWS.SQS;

  constructor() {
    AWS.config.update({
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
      region: process.env.REGION,
    });

    this.sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
  }

  async sendMessage(queueUrl: string, messageBody: string): Promise<void> {
    const params = {
      MessageBody: messageBody,
      QueueUrl: queueUrl,
    };

    await this.sqs.sendMessage(params).promise();
  }
}
