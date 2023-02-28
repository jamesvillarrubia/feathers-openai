
import { BadRequest } from '@feathersjs/errors';
import { openaiSetup } from './openai.setup.js';

export class CompletionService {
  constructor (options) {
    this.options = options;
  }

  async create (data, params) {
    return this.client.createCompletion({
      ...data
    }).then(r => r.data).catch(e => { console.log(e); throw new BadRequest(); });
  }

  async setup (app, path) { openaiSetup(app, this); }
}

export const completionOptions = (app) => {
  return { app };
};
