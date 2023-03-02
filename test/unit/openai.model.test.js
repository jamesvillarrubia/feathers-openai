
import assert from 'assert';
import feathers from '@feathersjs/feathers';
import { openai } from '../../src/index.js';
import nock from 'nock';
const app = feathers();
app.set('openai', 'fake-api-key');

describe('Model Service', () => {
  let name;
  let service;
  before(() => {
    app.configure(openai());
    app.setup();
    name = 'models';
    service = app.service(`openai/${name}`);
  });

  it('functions are set', async () => {
    it('.find', async () => {
      assert.strictEqual(typeof service.find, 'function');
    });
    it('.get', async () => {
      assert.strictEqual(typeof service.get, 'function');
    });
    it('.remove', async () => {
      assert.strictEqual(typeof service.remove, 'function');
    });
    it('.create', async () => {
      assert.strictEqual(typeof service.create, 'undefined');
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

  it('find return feathers object', async () => {
    nock('https://api.openai.com:443', { encodedQueryParams: true })
      .get(`/v1/${name}`)
      .reply(200, {
        object: 'list',
        data: [{}]
      });
    const result = await service.find({});
    assert.equal(result.data.length, 1);
  });

  it('get return simple object', async () => {
    nock('https://api.openai.com:443', { encodedQueryParams: true })
      .get(`/v1/${name}/text-davinci-003`)
      .reply(200, {
        id: 'babbage',
        object: 'model',
        created: 1649358449,
        owned_by: 'openai'
      });
    const result = await service.get('text-davinci-003');
    assert.equal(result.id, 'babbage');
  });
});
