import errorHandler from '../errorHandler.js';
import { openaiSetup } from './openai.setup.js';
import { BadRequest } from '@feathersjs/errors';
export class FileService {
  constructor (options) {
    this.options = options;
  }

  async create (data, params) {
    const file = params?.files.filter(f => f.fieldname === 'file')[0];
    if (!file) {
      throw new BadRequest('Form submission must include "file" field.');
    }
    if (!data.purpose) {
      throw new BadRequest('Form submission must include "purpose" field.');
    }
    const fileBuffer = Buffer.from(file.buffer);
    fileBuffer.name = 'file.jsonl';

    return this.client.createFile(
      fileBuffer,
      data.purpose
    ).then(r => r.data)
      .catch(errorHandler);
  }

  async find (params) {
    return this.client.listFiles()
      .then(r => {
        return {
          total: r.data?.data.length || 0,
          limit: null,
          skip: null,
          data: r.data
        };
      })
      .catch(errorHandler);
  }

  async get (id, params) {
    return this.client.retrieveFile(id).then(r => r.data).catch(errorHandler);
  }

  async remove (id, params) {
    return this.client.deleteFile(id).then(r => r.data).catch(errorHandler);
  }

  async setup (app, path) { openaiSetup(app, this); }
}

export class FileContentService {
  constructor (options) {
    this.options = options;
  }

  async find (params) {
    if (!(params.route && params.route.id)) throw new BadRequest();
    return this.client.downloadFile(params.route.id).then(r => r.data).catch(errorHandler);
  }
}

export const fileOptions = (app) => {
  return { app };
};
