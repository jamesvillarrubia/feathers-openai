"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fineTuneOptions = exports.fineTuneMethods = exports.FineTuneService = exports.FineTuneEventsService = exports.FineTuneCancelService = void 0;
var _errorHandler = _interopRequireDefault(require("../errorHandler.js"));
var _openaiSetup = require("./openai.setup.js");
var _errors = require("@feathersjs/errors");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class FineTuneService {
  constructor(options) {
    this.options = options;
  }
  async create(data, params) {
    return this.client.createFineTune({
      ...data
    }).then(r => r.data).catch(_errorHandler.default);
  }
  async find(params) {
    const limit = parseInt(params?.query?.$limit) || 1000;
    const skip = parseInt(params?.query?.$skip) || 0;
    return this.client.listFineTunes().then(r => {
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
    return this.client.retrieveFineTune(id).then(r => r.data).catch(_errorHandler.default);
  }
  async remove(id, params) {
    return this.client.deleteModel(id).then(r => r.data).catch(_errorHandler.default);
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
    return this.client.cancelFineTune(params.route.id).then(r => r.data).catch(_errorHandler.default);
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
    return this.client.listFineTuneEvents(params.route.id).then(r => r.data).catch(_errorHandler.default);
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