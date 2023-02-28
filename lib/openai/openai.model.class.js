"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modelMethods = exports.getOptions = exports.ModelService = void 0;
var _errors = require("@feathersjs/errors");
var _openaiSetup = require("./openai.setup.js");
class ModelService {
  constructor(options) {
    this.options = options;
  }
  async find(params) {
    return this.client.listModels().then(r => r.data).catch(e => {
      console.log(e);
      throw new _errors.BadRequest();
    });
  }
  async get(id, params) {
    return this.client.retrieveModel(id).then(r => r.data).catch(e => {
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
exports.ModelService = ModelService;
const modelMethods = ['find', 'get', 'remove'];
exports.modelMethods = modelMethods;
const getOptions = app => {
  return {
    app
  };
};
exports.getOptions = getOptions;