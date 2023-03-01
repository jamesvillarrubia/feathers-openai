import errorHandler from '../errorHandler.js';
import { openaiSetup } from './openai.setup.js';
import { Type } from '@feathersjs/typebox';
import { Ajv } from '@feathersjs/schema';
const ajv = new Ajv({});

const schema = Type.Object(
  {
    model: Type.String(),
    input: Type.Optional(Type.String()),
    instruction: Type.String(),
    n: Type.Optional(Type.Number()),
    temperature: Type.Optional(Type.Number()),
    top_p: Type.Optional(Type.Number())
  },
  { $id: 'openaiEdit', additionalProperties: false }
);
const validator = ajv.compile(schema);

export class EditService {
  constructor (options) {
    this.options = options;
  }

  async create (data, params) {
    if (!validator(data)) errorHandler(validator.errors[0]);

    return this.client.createEdit({
      ...data
    }).then(r => r.data).catch(errorHandler);
  }

  async setup (app, path) { openaiSetup(app, this); }
}

export const editOptions = (app) => {
  return { app };
};
