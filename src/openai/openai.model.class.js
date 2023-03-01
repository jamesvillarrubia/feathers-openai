import errorHandler from '../errorHandler.js';
import { openaiSetup } from './openai.setup.js';

export class ModelService {
  constructor (options) {
    this.options = options;
    this.id = 'id';
  }

  async find (params) {
    const limit = parseInt(params?.query?.$limit) || 1000;
    const skip = parseInt(params?.query?.$skip) || 0;

    return this.client.listModels()
      .then(r => {
        const data = r.data?.data.slice(skip).slice(0, limit);
        return {
          total: r.data?.data.length || 0,
          limit,
          skip,
          data
        };
      })
      .catch(errorHandler);
  }

  async get (id, params) {
    return this.client.retrieveModel(id).then(r => r.data).catch(errorHandler);
  }

  async remove (id, params) {
    return this.client.deleteModel(id).then(r => r.data).catch(errorHandler);
  }

  async setup (app, path) { openaiSetup(app, this); }
}

export const getOptions = (app) => {
  return { app };
};
