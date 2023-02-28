import { BadRequest } from '@feathersjs/errors';
import { openaiSetup } from './openai.setup.js';

export class EditService {
  constructor (options) {
    this.options = options;
  }

  async create (data, params) {
    return this.client.createEdit({
      ...data
    }).then(r => r.data).catch(e => { console.log(e); throw new BadRequest(); });
  }

  async setup (app, path) { openaiSetup(app, this); }
}

export const editOptions = (app) => {
  return { app };
};
