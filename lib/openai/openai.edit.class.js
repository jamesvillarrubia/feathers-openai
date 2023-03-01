"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.editOptions = exports.EditService = void 0;
var _errorHandler = _interopRequireDefault(require("../errorHandler.js"));
var _openaiSetup = require("./openai.setup.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class EditService {
  constructor(options) {
    this.options = options;
  }
  async create(data, params) {
    return this.client.createEdit({
      ...data
    }).then(r => r.data).catch(_errorHandler.default);
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