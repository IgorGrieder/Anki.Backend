import { OpenAPIV3 } from 'openapi-types';
import { commonResponses } from '../../infra/swagger/components';

const createUserSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    name: { type: 'string', example: 'Jane Doe' },
    email: { type: 'string', format: 'email', example: 'jane.doe@example.com' },
    password: {
      type: 'string',
      format: 'password',
      description: 'Minimum 8 characters',
      example: 'StrongPassword123',
    },
  },
  required: ['name', 'email', 'password'],
};

const path = '/api/auth';

export const accountPaths: OpenAPIV3.PathsObject = {
  [`${path}/create-account`]: {
    post: {
      tags: ['Authentication'],
      summary: 'Create a new user account',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: createUserSchema,
          },
        },
      },
      responses: {
        '201': {
          description: 'Account created successfully. A JWT cookie is set.',
          headers: {
            'Set-Cookie': {
              schema: {
                type: 'string',
                example: 'jwt=your-token-here; Max-Age=86400; Path=/; HttpOnly; SameSite=Strict',
              },
            },
          },
        },
        ...commonResponses,
      },
    },
  },
};
