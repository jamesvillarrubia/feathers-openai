"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fineTuneOptions = exports.fineTuneMethods = exports.FineTuneService = exports.FineTuneEventsService = exports.FineTuneCancelService = void 0;
var _errors = require("@feathersjs/errors");
var _openaiSetup = require("./openai.setup.js");
class FineTuneService {
  constructor(options) {
    this.options = options;
  }
  async create(data, params) {
    return this.client.createFineTune({
      ...data
    }).then(r => r.data).catch(e => {
      console.log(e);
      throw new _errors.BadRequest();
    });
  }
  async find(params) {
    return this.client.listFineTunes().then(r => r.data).catch(e => {
      console.log(e);
      throw new _errors.BadRequest();
    });
  }
  async get(id, params) {
    return this.client.retrieveFineTune(id).then(r => r.data).catch(e => {
      console.log(e);
      throw new _errors.BadRequest();
    });
  }
  async remove(id, params) {
    return this.client.deleteModel(id).then(r => r.data).catch(e => {
      console.log(e);
      throw new _errors.BadRequest();
    });
  }
  async setup(app, path) {
    (0, _openaiSetup.openaiSetup)(app, this);
  }
}
exports.FineTuneService = FineTuneService;
class FineTuneCancelService {
  constructor(options) {
    this.options = options;
  }
  async create(data, params) {
    if (!(params.route && params.route.id)) throw new _errors.BadRequest();
    return this.client.cancelFineTune(params.route.id).then(r => r.data).catch(e => {
      console.log(e);
      throw new _errors.BadRequest(e);
    });
  }
  async setup(app, path) {
    (0, _openaiSetup.openaiSetup)(app, this);
  }
}
exports.FineTuneCancelService = FineTuneCancelService;
class FineTuneEventsService {
  constructor(options) {
    this.options = options;
  }
  async find(params) {
    if (!(params.route && params.route.id)) throw new _errors.BadRequest();
    return this.client.listFineTuneEvents(params.route.id).then(r => r.data).catch(e => {
      console.log(e);
      throw new _errors.BadRequest(e);
    });
  }
  async setup(app, path) {
    (0, _openaiSetup.openaiSetup)(app, this);
  }
}
exports.FineTuneEventsService = FineTuneEventsService;
const fineTuneMethods = [];
exports.fineTuneMethods = fineTuneMethods;
const fineTuneOptions = app => {
  return {
    app
  };
};
exports.fineTuneOptions = fineTuneOptions;