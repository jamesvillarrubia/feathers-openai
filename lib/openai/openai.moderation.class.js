"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.moderationOptions = exports.ModerationService = void 0;
var _errorHandler = _interopRequireDefault(require("../errorHandler.js"));
var _openaiSetup = require("./openai.setup.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class ModerationService {
  constructor(options) {
    this.options = options;
  }
  async create(data, params) {
    return this.client.createModeration({
      ...data
    }).then(r => r.data).catch(_errorHandler.default);
  }
  async setup(app, path) {
    (0, _openaiSetup.openaiSetup)(app, this);
  }
}
exports.ModerationService = ModerationService;
const moderationOptions = app => {
  return {
    app
  };
};
exports.moderationOptions = moderationOptions;