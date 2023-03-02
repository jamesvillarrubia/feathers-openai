
import assert from 'assert';
import feathers from '@feathersjs/feathers';
import { openai } from '../../src/index.js';
import nock from 'nock';
import fs from 'fs';
import { join } from 'path';

const image = fs.readFileSync(join(__dirname, './otter.png'));
const poker = fs.readFileSync(join(__dirname, './poker.jsonl'));

describe('Configuration', () => {
  it('loads services at default prefix', async () => {
    const app = feathers();
    app.configure(openai());
    await app.setup();
    const service = app.service('openai/models');
    assert.ok(service);
  });

  it('can access prefix from app', async () => {
    const app = feathers();
    app.configure(openai('custom'));
    assert.strictEqual(app.get('openaiPrefix'), 'custom');
  });

  it('loads services with no prefix', async () => {
    const app = feathers();
    app.configure(openai(''));
    await app.setup();
    const service = app.service('models');
    assert.ok(service);
  });

  it('loads services with custom prefix', async () => {
    const app = feathers();
    app.configure(openai('custom-prefix-that-is-really-long'));
    await app.setup();
    const service = app.service('custom-prefix-that-is-really-long/models');
    assert.ok(service);
  });

  it('disallows unlisted endpoints', async () => {
    const app = feathers();
    app.configure(openai(undefined, ['models']));
    await app.setup();
    const modelService = app.service('openai/models');
    assert.ok(modelService);
    try {
      app.service('openai/edits');
    } catch (e) {
      assert.ok(e.message === 'Can not find service \'openai/edits\'');
    }
  });
});

describe('Hitting the OpenAI Service', () => {
  it('fetches a list of models from the service', async () => {
    nock('https://api.openai.com:443', { encodedQueryParams: true })
      .get('/v1/models')
      .reply(200, { object: 'list', data: [] }, [
        'Content-Type',
        'application/json'
      ]);
    const app = feathers();
    app.set('openai', 'fake-api-key');
    app.configure(openai());
    await app.setup();
    const service = app.service('openai/models');
    const result = await service.find();
    assert.strictEqual(result.total, 0);
  });

  it('can upload an image', async () => {
    nock('https://api.openai.com:443', { encodedQueryParams: true })
      .post('/v1/images/variations', /2d2d2d2d2d2d.*/gi)
      .reply(200, {
        created: 1677613784,
        data: [
          { url: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QgOYEPxBrNrpMwIpOpF5LUX6/user-DO8hb2JNa5BSlcZHTnUBGWdl/img-yfJpn9y1KbJAoQ75FAjmr45U.png?st=2023-02-28T18%3A49%3A44Z&se=2023-02-28T20%3A49%3A44Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-02-28T08%3A44%3A32Z&ske=2023-03-01T08%3A44%3A32Z&sks=b&skv=2021-08-06&sig=Ryqu7OhhnHIJM12L%2B7hZ4vLn%2BtOuEmsD%2B0Lc9WHtHNo%3D' }]
      }, [
        'Content-Type',
        'application/json'
      ]);

    const app = feathers();
    app.set('openai', 'fake-api-key');
    app.configure(openai());
    await app.setup();
    const service = app.service('openai/images/variations');
    const result = await service.create({
      n: 2,
      size: '1024x1024'
    }, {
      files: [{ buffer: image, fieldname: 'image' }]
    });
    assert.equal(result.data.length, 1);
  });

  it('can use nested route', async () => {
    const id = 'abcdefghijk';
    nock('https://api.openai.com:443', { encodedQueryParams: true })
      .post(`/v1/fine-tunes/${id}/cancel`)
      .reply(200, { data: { id } }, [
        'Content-Type',
        'application/json'
      ]);
    const app = feathers();
    app.set('openai', 'fake-api-key');
    app.configure(openai());
    await app.setup();
    const service = app.service('openai/fine-tunes/:id/cancel');
    const result = await service.create({}, { route: { id } });
    assert.equal(result.data.id, id);
  });

  it('can upload file', async () => {
    nock('https://api.openai.com:443', { encodedQueryParams: true })
      .post('/v1/files', /prompt.*/gi)
      .reply(200, { object: 'file', id: 'file-RtaqXXXXXXXXXXIchEw6HTKQ', purpose: 'fine-tune', filename: 'file.jsonl', bytes: 208, created_at: 1677621720, status: 'uploaded', status_details: null }, [
        'Content-Type',
        'application/json'
      ]);
    const app = feathers();
    app.set('openai', 'fake-api-key');
    app.configure(openai());
    await app.setup();
    const service = app.service('openai/files');
    const result = await service.create({
      purpose: 'fine-tune'
    }, {
      files: [{ buffer: poker, fieldname: 'file' }]
    });
    assert.equal(result.object, 'file');
  });

  /**
   * DISABLED UNTIL PAID ACCOUNT CAN BE USED FOR TESTING
   */
  // it('can download file', async () => {
  //   nock('https://api.openai.com:443', { encodedQueryParams: true })
  //     .post('/v1/files', /prompt.*/gi)
  //     .reply(200, { object: 'file', id: 'file-RtaqXXXXXXXXXXIchEw6HTKQ', purpose: 'fine-tune', filename: 'file.jsonl', bytes: 208, created_at: 1677621720, status: 'uploaded', status_details: null }, [
  //       'Content-Type',
  //       'application/json'
  //     ]);
  //   const app = feathers();
  //   app.set('openai', 'fake-api-key');
  //   app.configure(openai());
  //   await app.setup();
  //   const service = app.service('openai/files/file-RtaqXXXXXXXXXXIchEw6HTKQ');
  //   const result = await service.create({
  //     purpose: 'fine-tune'
  //   }, {
  //     files: [{ buffer: poker, fieldname: 'file' }]
  //   });
  //   assert.equal(result.object, 'file');
  // });
});
