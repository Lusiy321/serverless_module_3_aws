/* eslint-disable prettier/prettier */
import { verify, JwtPayload } from 'jsonwebtoken';
// import { APIGatewayAuthorizerResult } from 'aws-lambda';

export const handler = async (req: any): Promise<any> => {
  try {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer') {
      throw new Error('Not authorized');
    }

    const SECRET_KEY = process.env.SECRET_KEY;
    const findEmail = verify(token, SECRET_KEY) as JwtPayload;
    const { email } = findEmail;

    return generatePolicy(email.length, email);
  } catch (e) {
    console.error('Error in auth-verifier lambda:', e);
    return generatePolicy('user', 'Deny');
  }
};

const generatePolicy = (principalId: string, effect: string): any => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Email: effect,
      Statement: [
        {
          Sid: '__owner_statement',
          Effect: effect,
          Principal: {
            AWS: '338220707012',
          },
          Action: ['SQS:*'],
          Resource: 'arn:aws:sqs:eu-central-1:338220707012:Queues_module_3',
        },
      ],
    },
  };
};
