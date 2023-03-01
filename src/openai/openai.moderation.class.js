import errorHandler from '../errorHandler.js';
import { openaiSetup } from './openai.setup.js';
import { Type } from '@feathersjs/typebox';
import { Ajv } from '@feathersjs/schema';
const ajv = new Ajv({});

const schema = Type.Object(
  {
    model: Type.Optional(Type.Union([
      Type.Literal('text-moderation-stable'),
      Type.Literal('text-moderation-latest')
    ])),
    input: Type.Union([Type.Array(Type.String()), Type.String()])
  },
  { $id: 'openaiModeration', additionalProperties: false }
);
const validator = ajv.compile(schema);

export class ModerationService {
  constructor (options) {
    this.options = options;
  }

  async create (data, params) {
    if (!validator(data)) errorHandler(validator.errors[0]);

    return this.client.createModeration({
      ...data
    }).then(r => r.data).catch(errorHandler);
  }

  async setup (app, path) { openaiSetup(app, this); }
}

export const moderationOptions = (app) => {
  return { app };
};
