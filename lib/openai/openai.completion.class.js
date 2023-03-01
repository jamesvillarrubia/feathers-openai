"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.completionOptions = exports.CompletionService = void 0;
var _openaiSetup = require("./openai.setup.js");
var _errorHandler = _interopRequireDefault(require("../errorHandler.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class CompletionService {
  constructor(options) {
    this.options = options;
  }
  async create(data, params) {
    return this.client.createCompletion({
      ...data
    }).then(r => r.data).catch(_errorHandler.default);
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