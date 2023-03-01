
import { openaiSetup } from './openai.setup.js';
import errorHandler from '../errorHandler.js';
import { Type } from '@feathersjs/typebox';
import { Ajv } from '@feathersjs/schema';
const ajv = new Ajv({});

const schema = Type.Object(
  {
    model: Type.String(),
    prompt: Type.Optional(Type.Union([Type.Array(Type.String()), Type.String()])),
    suffix: Type.Optional(Type.String()),
    max_tokens: Type.Optional(Type.Number()),
    temperature: Type.Optional(Type.Number()),
    top_p: Type.Optional(Type.Number()),
    n: Type.Optional(Type.Number()),
    stream: Type.Optional(Type.Boolean()),
    logprobs: Type.Optional(Type.Number()),
    stop: Type.Optional(Type.Union([Type.Array(Type.String()), Type.String()])),
    echo: Type.Optional(Type.Boolean()),
    presence_penalty: Type.Optional(Type.Number()),
    frequency_penalty: Type.Optional(Type.Number()),
    best_of: Type.Optional(Type.Number()),
    logit_bias: Type.Optional(Type.Number()),
    user: Type.Optional(Type.String())
  },
  { $id: 'openaiModel', additionalProperties: false }
);
const validator = ajv.compile(schema);

export class CompletionService {
  constructor (options) {
    this.options = options;
  }

  async create (data, params) {
    if (!validator(data)) errorHandler(validator.errors[0]);
    return this.client.createCompletion({
      ...data
    }).then(r => r.data).catch(errorHandler);
  }

  async setup (app, path) { openaiSetup(app, this); }
}

export const completionOptions = (app) => {
  return { app };
};
