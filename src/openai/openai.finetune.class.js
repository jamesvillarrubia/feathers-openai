import { BadRequest } from '@feathersjs/errors';
import { openaiSetup } from './openai.setup.js';

export class FineTuneService {
  constructor (options) {
    this.options = options;
  }

  async create (data, params) {
    return this.client.createFineTune({
      ...data
    }).then(r => r.data).catch(e => { console.log(e); throw new BadRequest(); });
  }

  async find (params) {
    return this.client.listFineTunes().then(r => r.data).catch(e => { console.log(e); throw new BadRequest(); });
  }

  async get (id, params) {
    return this.client.retrieveFineTune(id).then(r => r.data).catch(e => { console.log(e); throw new BadRequest(); });
  }

  async remove (id, params) {
    return this.client.deleteModel(id).then(r => r.data).catch(e => { console.log(e); throw new BadRequest(); });
  }

  async setup (app, path) { openaiSetup(app, this); }
}

export class FineTuneCancelService {
  constructor (options) {
    this.options = options;
  }

  async create (data, params) {
    if (!(params.route && params.route.id)) throw new BadRequest();
    return this.client.cancelFineTune(params.route.id).then(r => r.data).catch(e => { console.log(e); throw new BadRequest(e); });
  }

  async setup (app, path) { openaiSetup(app, this); }
}

export class FineTuneEventsService {
  constructor (options) {
    this.options = options;
  }

  async find (params) {
    if (!(params.route && params.route.id)) throw new BadRequest();
    return this.client.listFineTuneEvents(params.route.id).then(r => r.data).catch(e => { console.log(e); throw new BadRequest(e); });
  }

  async setup (app, path) { openaiSetup(app, this); }
}

export const fineTuneMethods = [];

export const fineTuneOptions = (app) => {
  return { app };
};
