import { BadRequest } from '@feathersjs/errors';
import { openaiSetup } from './openai.setup.js';

export class ModelService {
  constructor (options) {
    this.options = options;
  }

  async find (params) {
    return this.client.listModels().then(r => r.data).catch(e => { console.log(e); throw new BadRequest(); });
  }

  async get (id, params) {
    return this.client.retrieveModel(id).then(r => r.data).catch(e => { console.log(e); throw new BadRequest(); });
  }

  async remove (id, params) {
    return this.client.deleteModel(id).then(r => r.data).catch(e => { console.log(e); throw new BadRequest(); });
  }

  async setup (app, path) { openaiSetup(app, this); }
}

export const modelMethods = ['find', 'get', 'remove'];

export const getOptions = (app) => {
  return { app };
};
