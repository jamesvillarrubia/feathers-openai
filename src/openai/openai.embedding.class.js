import { openaiSetup } from './openai.setup.js';
import errorHandler from '../errorHandler.js';
import { Type } from '@feathersjs/typebox';
import { Ajv } from '@feathersjs/schema';
const ajv = new Ajv({});

const schema = Type.Object(
  {
    model: Type.String(),
    input: Type.String(),
    user: Type.Optional(Type.String())
  },
  { $id: 'openaiEmbedding', additionalProperties: false }
);
const validator = ajv.compile(schema);

export class EmbeddingService {
  constructor (options) {
    this.options = options;
  }

  async create (data, params) {
    if (!validator(data)) errorHandler(validator.errors[0]);

    return this.client.createEmbedding({
      ...data
    }).then(r => r.data)
      .catch(errorHandler);
  }

  async setup (app, path) { openaiSetup(app, this); }
}

export const embeddingOptions = (app) => {
  return { app };
};
