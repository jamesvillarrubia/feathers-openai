"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.moderationOptions = exports.ModerationService = void 0;
var _errors = require("@feathersjs/errors");
var _openaiSetup = require("./openai.setup.js");
class ModerationService {
  constructor(options) {
    this.options = options;
  }
  async create(data, params) {
    return this.client.createModeration({
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
exports.ModerationService = ModerationService;
const moderationOptions = app => {
  return {
    app
  };
};
exports.moderationOptions = moderationOptions;