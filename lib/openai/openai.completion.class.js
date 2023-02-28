"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.completionOptions = exports.CompletionService = void 0;
var _errors = require("@feathersjs/errors");
var _openaiSetup = require("./openai.setup.js");
class CompletionService {
  constructor(options) {
    this.options = options;
  }
  async create(data, params) {
    return this.client.createCompletion({
      ...data
    }).then(r => r.data).catch(e => {
      console.log(e);
      throw new _errors.BadRequest();
    });
  }
  async setup(app, path) {
    (0, _openaiSetup.openaiSetup)(app, this);
  }
}
exports.CompletionService = CompletionService;
const completionOptions = app => {
  return {
    app
  };
};
exports.completionOptions = completionOptions;