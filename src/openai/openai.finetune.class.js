import errorHandler from '../errorHandler.js';
import { openaiSetup } from './openai.setup.js';
import { BadRequest } from '@feathersjs/errors';
import { Type } from '@feathersjs/typebox';
import { Ajv } from '@feathersjs/schema';
const ajv = new Ajv({});

const schema = Type.Object(
  {
    training_file: Type.String(),
    validation_file: Type.Optional(Type.String()),
    model: Type.Optional(Type.String()),
    n_epochs: Type.Optional(Type.Number()),
    batch_size: Type.Optional(Type.Number()),
    learning_rate_multiplier: Type.Optional(Type.Number()),
    prompt_loss_weight: Type.Optional(Type.Number()),
    compute_classification_metrics: Type.Optional(Type.Boolean()),
    classification_n_classes: Type.Optional(Type.Number()),
    classification_positive_class: Type.Optional(Type.String()),
    classification_betas: Type.Optional(Type.Array(Type.Number())),
    suffix: Type.Optional(Type.String())
  },
  { $id: 'openaiFineTune', additionalProperties: false }
);
const validator = ajv.compile(schema);

export class FineTuneService {
  constructor (options) {
    this.options = options;
  }

  async create (data, params) {
    if (!validator(data)) errorHandler(validator.errors[0]);
    return this.client.createFineTune({
      ...data
    }).then(r => r.data)
      .catch(errorHandler);
  }

  async find (params) {
    const limit = parseInt(params?.query?.$limit) || 1000;
    const skip = parseInt(params?.query?.$skip) || 0;

    return this.client.listFineTunes()
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
    return this.client.retrieveFineTune(id).then(r => r.data).catch(errorHandler);
  }

  async remove (id, params) {
    return this.client.deleteModel(id).then(r => r.data).catch(errorHandler);
  }

  async setup (app, path) { openaiSetup(app, this); }
}

export class FineTuneCancelService {
  constructor (options) {
    this.options = options;
  }

  async create (data, params) {
    if (!(params.route && params.route.id)) throw new BadRequest();
    return this.client.cancelFineTune(params.route.id).then(r => r.data).catch(errorHandler);
  }

  async setup (app, path) { openaiSetup(app, this); }
}

export class FineTuneEventsService {
  constructor (options) {
    this.options = options;
  }

  async find (params) {
    if (!(params.route && params.route.id)) throw new BadRequest();
    return this.client.listFineTuneEvents(params.route.id).then(r => r.data).catch(errorHandler);
  }

  async setup (app, path) { openaiSetup(app, this); }
}

export const fineTuneMethods = [];

export const fineTuneOptions = (app) => {
  return { app };
};
