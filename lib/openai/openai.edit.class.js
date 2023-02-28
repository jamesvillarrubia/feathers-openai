"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.editOptions = exports.EditService = void 0;
var _errors = require("@feathersjs/errors");
var _openaiSetup = require("./openai.setup.js");
class EditService {
  constructor(options) {
    this.options = options;
  }
  async create(data, params) {
    return this.client.createEdit({
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
exports.EditService = EditService;
const editOptions = app => {
  return {
    app
  };
};
exports.editOptions = editOptions;