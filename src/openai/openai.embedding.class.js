import { BadRequest } from '@feathersjs/errors';
import { openaiSetup } from './openai.setup.js';

export class EmbeddingService {
  constructor (options) {
    this.options = options;
  }

  async create (data, params) {
    return this.client.createEmbedding({
      ...data
    }).then(r => r.data).catch(e => { console.log(e); throw new BadRequest(); });
  }

  async setup (app, path) { openaiSetup(app, this); }
}

export const embeddingMethods = [];

export const embeddingOptions = (app) => {
  return { app };
};
