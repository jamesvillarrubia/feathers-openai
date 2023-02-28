"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.embeddingOptions = exports.embeddingMethods = exports.EmbeddingService = void 0;
var _errors = require("@feathersjs/errors");
var _openaiSetup = require("./openai.setup.js");
class EmbeddingService {
  constructor(options) {
    this.options = options;
  }
  async create(data, params) {
    return this.client.createEmbedding({
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
exports.EmbeddingService = EmbeddingService;
const embeddingMethods = [];
exports.embeddingMethods = embeddingMethods;
const embeddingOptions = app => {
  return {
    app
  };
};
exports.embeddingOptions = embeddingOptions;