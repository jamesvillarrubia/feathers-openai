import { BadRequest } from '@feathersjs/errors';
import { openaiSetup } from './openai.setup.js';

export class ImageGenService {
  constructor (options) {
    this.options = options;
  }

  async create (data, params) {
    return this.client.createImage({
      ...data
    }).then(r => r.data).catch(e => { console.log(e); throw new BadRequest(); });
  }

  async setup (app, path) { openaiSetup(app, this); }
}

// TODO Needs Multer
export class ImageVarService {
  constructor (options) {
    this.options = options;
  }

  async create (data, params) {
    const image = params?.files.filter(f => f.fieldname === 'image')[0];

    if (!image) {
      throw new BadRequest('Form submission must include "image" field.');
    }
    const imageBuffer = Buffer.from(image.buffer);
    imageBuffer.name = 'image.png';

    return this.client.createImageVariation(
      imageBuffer,
      params.n || 1,
      params.size || '256x256'
    ).then(r => r.data)
      .catch(e => {
        console.error(e);
        throw new BadRequest(e.message);
      });
  }

  async setup (app, path) { openaiSetup(app, this); }
}

export class ImageEditService {
  constructor (options) {
    this.options = options;
  }

  async create (data, params) {
    const image = params?.files.filter(f => f.fieldname === 'image')[0];
    const mask = params?.files.filter(f => f.fieldname === 'mask')[0];

    const imageBuffer = Buffer.from(image.buffer);
    const maskBuffer = mask.buffer ? Buffer.from(mask.buffer) : undefined;
    if (!image) {
      throw new BadRequest('Form submission must include "image" field.');
    }
    if (!data.prompt) {
      throw new BadRequest('Form submission must include "prompt" field.');
    }

    imageBuffer.name = 'image.png';
    maskBuffer.name = 'image.png';

    // image, mask, prompt, n, size, responseFormat, user, options = {}
    return this.client.createImageEdit(
      imageBuffer,
      maskBuffer,
      data.prompt,
      data.n || 1,
      data.size || '256x256',
      data.response_format || 'url',
      data.user || undefined
    ).then(r => r.data)
      .catch(error => {
        if (error.response) {
          console.log(error.response.status);
          console.log(error.response.data);
        } else {
          console.log(error.message);
        }
        throw new BadRequest(error.message);
      });
  }

  async setup (app, path) {
    openaiSetup(app, this);
    this.options.app = app;
  }
}

export const imageEditOptions = (app) => {
  return { app };
};
export const imageGenOptions = (app) => {
  return { app };
};
export const imageVarOptions = (app) => {
  return { app };
};
