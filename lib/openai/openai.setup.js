"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openaiSetup = void 0;
var _openai = require("openai");
const openaiSetup = (app, service) => {
  const configuration = new _openai.Configuration({
    apiKey: app.get('openai')
  });
  service.client = new _openai.OpenAIApi(configuration);
};
exports.openaiSetup = openaiSetup;