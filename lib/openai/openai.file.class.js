"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fileOptions = exports.FileService = exports.FileContentService = void 0;
var _errors = require("@feathersjs/errors");
var _openaiSetup = require("./openai.setup.js");
class FileService {
  constructor(options) {
    this.options = options;
  }
  async create(data, params) {
    const file = params?.files.filter(f => f.fieldname === 'file')[0];
    if (!file) {
      throw new _errors.BadRequest('Form submission must include "file" field.');
    }
    if (!data.purpose) {
      throw new _errors.BadRequest('Form submission must include "purpose" field.');
    }
    const fileBuffer = Buffer.from(file.buffer);
    fileBuffer.name = 'file.jsonl';
    return this.client.createFile(fileBuffer, data.purpose).then(r => r.data).catch(e => {
      console.error(e);
      throw new _errors.BadRequest(e.message);
    });
  }
  async find(params) {
    return this.client.listFiles().then(r => r.data).catch(e => {
      console.log(e);
      throw new _errors.BadRequest();
    });
  }
  async get(id, params) {
    return this.client.retrieveFile(id).then(r => r.data).catch(e => {
      console.log(e);
      throw new _errors.BadRequest();
    });
  }
  async remove(id, params) {
    return this.client.deleteFile(id).then(r => r.data).catch(e => {
      console.log(e);
      throw new _errors.BadRequest();
    });
  }
  async setup(app, path) {
    (0, _openaiSetup.openaiSetup)(app, this);
  }
}
exports.FileService = FileService;
class FileContentService {
  constructor(options) {
    this.options = options;
  }
  async find(params) {
    if (!(params.route && params.route.id)) throw new _errors.BadRequest();
    return this.client.downloadFile(params.route.id).then(r => r.data).catch(e => {
      console.log(e);
      throw new _errors.BadRequest(e);
    });
  }
}
exports.FileContentService = FileContentService;
const fileOptions = app => {
  return {
    app
  };
};
exports.fileOptions = fileOptions;