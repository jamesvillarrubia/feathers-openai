"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.imageVarOptions = exports.imageGenOptions = exports.imageEditOptions = exports.ImageVarService = exports.ImageGenService = exports.ImageEditService = void 0;
var _errors = require("@feathersjs/errors");
var _openaiSetup = require("./openai.setup.js");
class ImageGenService {
  constructor(options) {
    this.options = options;
  }
  async create(data, params) {
    return this.client.createImage({
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

// TODO Needs Multer
exports.ImageGenService = ImageGenService;
class ImageVarService {
  constructor(options) {
    this.options = options;
  }
  async create(data, params) {
    const image = params?.files.filter(f => f.fieldname === 'image')[0];
    if (!image) {
      throw new _errors.BadRequest('Form submission must include "image" field.');
    }
    const imageBuffer = Buffer.from(image.buffer);
    imageBuffer.name = 'image.png';
    return this.client.createImageVariation(imageBuffer, params.n || 1, params.size || '256x256').then(r => r.data).catch(e => {
      console.error(e);
      throw new _errors.BadRequest(e.message);
    });
  }
  async setup(app, path) {
    (0, _openaiSetup.openaiSetup)(app, this);
  }
}
exports.ImageVarService = ImageVarService;
class ImageEditService {
  constructor(options) {
    this.options = options;
  }
  async create(data, params) {
    const image = params?.files.filter(f => f.fieldname === 'image')[0];
    const mask = params?.files.filter(f => f.fieldname === 'mask')[0];
    const imageBuffer = Buffer.from(image.buffer);
    const maskBuffer = mask.buffer ? Buffer.from(mask.buffer) : undefined;
    if (!image) {
      throw new _errors.BadRequest('Form submission must include "image" field.');
    }
    if (!data.prompt) {
      throw new _errors.BadRequest('Form submission must include "prompt" field.');
    }
    imageBuffer.name = 'image.png';
    maskBuffer.name = 'image.png';

    // image, mask, prompt, n, size, responseFormat, user, options = {}
    return this.client.createImageEdit(imageBuffer, maskBuffer, data.prompt, data.n || 1, data.size || '256x256', data.response_format || 'url', data.user || undefined).then(r => r.data).catch(error => {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
      throw new _errors.BadRequest(error.message);
    });
  }
  async setup(app, path) {
    (0, _openaiSetup.openaiSetup)(app, this);
    this.options.app = app;
  }
}
exports.ImageEditService = ImageEditService;
const imageEditOptions = app => {
  return {
    app
  };
};
exports.imageEditOptions = imageEditOptions;
const imageGenOptions = app => {
  return {
    app
  };
};
exports.imageGenOptions = imageGenOptions;
const imageVarOptions = app => {
  return {
    app
  };
};
exports.imageVarOptions = imageVarOptions;