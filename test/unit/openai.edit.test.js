
import assert from 'assert';
import feathers from '@feathersjs/feathers';
import { openai } from '../../src/index.js';
import nock from 'nock';

const app = feathers();
app.set('openai', 'fake-api-key');

describe('Edit Service', async () => {
  let name;
  let service;

  before(() => {
    app.configure(openai());
    app.setup();
    name = 'edits';
    service = app.service(`openai/${name}`);
  });

  it('functions are set', async () => {
    it('.find', async () => {
      assert.strictEqual(typeof service.find, 'undefined');
    });
    it('.get', async () => {
      assert.strictEqual(typeof service.get, 'undefined');
    });
    it('.remove', async () => {
      assert.strictEqual(typeof service.remove, 'undefined');
    });
    it('.create', async () => {
      assert.strictEqual(typeof service.create, 'function');
    });
    it('.update', async () => {
      assert.strictEqual(typeof service.update, 'undefined');
    });
    it('.patch', async () => {
      assert.strictEqual(typeof service.patch, 'undefined');
    });
    it('.setup', async () => {
      assert.strictEqual(typeof service.setup, 'function');
    });
  });

  it('create returns simple object', async () => {
    nock('https://api.openai.com:443', { encodedQueryParams: true })
      .post(`/v1/${name}`, /.*/gi)
      .reply(200, {
        object: 'edit',
        created: 1670702460
      });
    const result = await service.create({
      model: 'model',
      instruction: ''
    });
    assert.equal(result.object, 'edit');
  });
});
