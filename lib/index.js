"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openaiPath = exports.openaiMulter = exports.openai = exports.baseMethods = exports.baseEntities = void 0;
var _openaiModelClass = require("./openai/openai.model.class.js");
var _openaiCompletionClass = require("./openai/openai.completion.class.js");
var _openaiEditClass = require("./openai/openai.edit.class.js");
var _openaiEmbeddingClass = require("./openai/openai.embedding.class.js");
var _openaiModerationClass = require("./openai/openai.moderation.class.js");
var _openaiFileClass = require("./openai/openai.file.class.js");
var _openaiFinetuneClass = require("./openai/openai.finetune.class.js");
var _openaiImageClass = require("./openai/openai.image.class.js");
const openaiPath = 'openai';
exports.openaiPath = openaiPath;
const baseMethods = ['find', 'get', 'create', 'patch', 'update', 'remove'];
exports.baseMethods = baseMethods;
const baseEntities = ['models', 'edits', 'completions', 'images/generations', 'images/edits', 'images/variations', 'fine-tunes', 'embeddings', 'moderations', 'files'];
exports.baseEntities = baseEntities;
const openaiMulter = async (ctx, next) => {
  ctx.feathers.files = [ctx.file, ...ctx.files].filter(f => !!f);
  await next();
};
exports.openaiMulter = openaiMulter;
const openai = (prefix = openaiPath, allowedEntities = baseEntities) => {
  return app => {
    app.set('openaiPrefix', prefix);
    if (allowedEntities.includes('models')) {
      app.use(prefix + '/models', new _openaiModelClass.ModelService((0, _openaiModelClass.getOptions)(app)), {
        methods: ['find', 'get', 'remove'],
        events: []
      });
    }
    if (allowedEntities.includes('edits')) {
      app.use(prefix + '/edits', new _openaiEditClass.EditService((0, _openaiEditClass.editOptions)(app)), {
        methods: ['create'],
        events: []
      });
    }
    if (allowedEntities.includes('completions')) {
      app.use(prefix + '/completions', new _openaiCompletionClass.CompletionService((0, _openaiCompletionClass.completionOptions)(app)), {
        methods: ['create'],
        events: []
      });
    }
    if (allowedEntities.includes('images/generations')) {
      app.use(prefix + '/images/generations', new _openaiImageClass.ImageGenService((0, _openaiImageClass.imageGenOptions)(app)), {
        methods: ['create'],
        events: []
      });
    }
    if (allowedEntities.includes('images/edits')) {
      app.use(prefix + '/images/edits', new _openaiImageClass.ImageEditService((0, _openaiImageClass.imageEditOptions)(app), {
        methods: ['create'],
        events: []
      }));
    }
    if (allowedEntities.includes('images/variations')) {
      app.use(prefix + '/images/variations', new _openaiImageClass.ImageVarService((0, _openaiImageClass.imageVarOptions)(app)), {
        methods: ['create'],
        events: []
      });
    }
    if (allowedEntities.includes('fine-tunes')) {
      app.use(prefix + '/fine-tunes', new _openaiFinetuneClass.FineTuneService((0, _openaiFinetuneClass.fineTuneOptions)(app)), {
        methods: ['find', 'get', 'create', 'remove'],
        events: []
      });
      app.use(prefix + '/fine-tunes/:id/cancel', new _openaiFinetuneClass.FineTuneCancelService((0, _openaiFinetuneClass.fineTuneOptions)(app)), {
        methods: ['create'],
        events: []
      });
      app.use(prefix + '/fine-tunes/:id/events', new _openaiFinetuneClass.FineTuneEventsService((0, _openaiFinetuneClass.fineTuneOptions)(app)), {
        methods: ['find'],
        events: []
      });
    }
    if (allowedEntities.includes('embeddings')) {
      app.use(prefix + '/embeddings', new _openaiEmbeddingClass.EmbeddingService((0, _openaiEmbeddingClass.embeddingOptions)(app)), {
        methods: ['create'],
        events: []
      });
    }
    if (allowedEntities.includes('moderations')) {
      app.use(prefix + '/moderations', new _openaiModerationClass.ModerationService((0, _openaiModerationClass.moderationOptions)(app)), {
        methods: ['create'],
        events: []
      });
    }
    if (allowedEntities.includes('files')) {
      app.use(prefix + '/files', new _openaiFileClass.FileService((0, _openaiFileClass.fileOptions)(app)), {
        methods: ['create', 'find', 'get', 'remove'],
        events: []
      });
      app.use(prefix + '/files/:id/content', new _openaiFileClass.FileContentService((0, _openaiFileClass.fileOptions)(app)), {
        methods: ['find'],
        events: []
      });
    }
  };
};
exports.openai = openai;