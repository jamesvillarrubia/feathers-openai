"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOptions = exports.ModelService = void 0;
var _errorHandler = _interopRequireDefault(require("../errorHandler.js"));
var _openaiSetup = require("./openai.setup.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class ModelService {
  constructor(options) {
    this.options = options;
    this.id = 'id';
  }
  async find(params) {
    const limit = parseInt(params?.query?.$limit) || 1000;
    const skip = parseInt(params?.query?.$skip) || 0;
    return this.client.listModels().then(r => {
      const data = r.data?.data.slice(skip).slice(0, limit);
      return {
        total: r.data?.data.length || 0,
        limit,
        skip,
        data
      };
    }).catch(_errorHandler.default);
  }
  async get(id, params) {
    return this.client.retrieveModel(id).then(r => r.data).catch(_errorHandler.default);
  }
  async remove(id, params) {
    return this.client.deleteModel(id).then(r => r.data).catch(_errorHandler.default);
  }
  async setup(app, path) {
    (0, _openaiSetup.openaiSetup)(app, this);
  }
}
exports.ModelService = ModelService;
const getOptions = app => {
  return {
    app
  };
};
exports.getOptions = getOptions;