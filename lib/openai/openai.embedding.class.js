"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.embeddingOptions = exports.embeddingMethods = exports.EmbeddingService = void 0;
var _openaiSetup = require("./openai.setup.js");
var _errorHandler = _interopRequireDefault(require("../errorHandler.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class EmbeddingService {
  constructor(options) {
    this.options = options;
  }
  async create(data, params) {
    return this.client.createEmbedding({
      ...data
    }).then(r => r.data).catch(_errorHandler.default);
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