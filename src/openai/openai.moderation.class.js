import { BadRequest } from '@feathersjs/errors';
import { openaiSetup } from './openai.setup.js';

export class ModerationService {
  constructor (options) {
    this.options = options;
  }

  async create (data, params) {
    return this.client.createModeration({
      ...data
    }).then(r => r.data).catch(e => { console.log(e); throw new BadRequest(); });
  }

  async setup (app, path) { openaiSetup(app, this); }
}

export const moderationOptions = (app) => {
  return { app };
};
