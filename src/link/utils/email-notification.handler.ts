/* eslint-disable prettier/prettier */
import { SQSEvent } from 'aws-lambda';
import { SendGridService } from './sendGrid.service';

const sendGridService = new SendGridService();
export const handler = async (event: SQSEvent): Promise<void> => {
  try {
    const messages = event.Records.map((record) => JSON.parse(record.body));

    for (const message of messages) {
      await sendGridService.sendEmail({
        to: message.userEmail,
        from: 'lusiy321@gmail.com',
        subject: 'Your link has been deactivate',
        text: `Your link ${message.linkId} has been deactivate .`,
      });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
