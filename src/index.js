import { ModelService, getOptions as modelOptions } from './openai/openai.model.class.js';
import { CompletionService, completionOptions } from './openai/openai.completion.class.js';
import { EditService, editOptions } from './openai/openai.edit.class.js';
import { EmbeddingService, embeddingOptions } from './openai/openai.embedding.class.js';
import { ModerationService, moderationOptions } from './openai/openai.moderation.class.js';
import { FileService, FileContentService, fileOptions } from './openai/openai.file.class.js';
import { FineTuneService, fineTuneOptions, FineTuneCancelService, FineTuneEventsService } from './openai/openai.finetune.class.js';
import {
  ImageGenService, ImageEditService, ImageVarService,
  imageGenOptions, imageEditOptions, imageVarOptions
} from './openai/openai.image.class.js';

export const openaiPath = 'openai';
export const baseMethods = ['find', 'get', 'create', 'patch', 'update', 'remove'];
export const baseEntities = ['models', 'edits', 'completions', 'images/generations', 'images/edits', 'images/variations', 'fine-tunes', 'embeddings', 'moderations', 'files'];

export const openaiMulter = async (ctx, next) => {
  ctx.feathers.files = [ctx.file, ...(ctx.files ? ctx.files : [])].filter(f => !!f);
  await next();
};

export const openai = (prefix = openaiPath, allowedEntities = baseEntities) => {
  return (app) => {
    app.set('openaiPrefix', prefix);
    if (allowedEntities.includes('models')) { app.use(prefix + '/models', new ModelService(modelOptions(app)), { methods: ['find', 'get', 'remove'], events: [] }); }
    if (allowedEntities.includes('edits')) { app.use(prefix + '/edits', new EditService(editOptions(app)), { methods: ['create'], events: [] }); }
    if (allowedEntities.includes('completions')) { app.use(prefix + '/completions', new CompletionService(completionOptions(app)), { methods: ['create'], events: [] }); }
    if (allowedEntities.includes('images/generations')) { app.use(prefix + '/images/generations', new ImageGenService(imageGenOptions(app)), { methods: ['create'], events: [] }); }
    if (allowedEntities.includes('images/edits')) { app.use(prefix + '/images/edits', new ImageEditService(imageEditOptions(app), { methods: ['create'], events: [] })); }
    if (allowedEntities.includes('images/variations')) { app.use(prefix + '/images/variations', new ImageVarService(imageVarOptions(app)), { methods: ['create'], events: [] }); }
    if (allowedEntities.includes('fine-tunes')) {
      app.use(prefix + '/fine-tunes', new FineTuneService(fineTuneOptions(app)), { methods: ['find', 'get', 'create', 'remove'], events: [] });
      app.use(prefix + '/fine-tunes/:id/cancel', new FineTuneCancelService(fineTuneOptions(app)), { methods: ['create'], events: [] });
      app.use(prefix + '/fine-tunes/:id/events', new FineTuneEventsService(fineTuneOptions(app)), { methods: ['find'], events: [] });
    }
    if (allowedEntities.includes('embeddings')) { app.use(prefix + '/embeddings', new EmbeddingService(embeddingOptions(app)), { methods: ['create'], events: [] }); }
    if (allowedEntities.includes('moderations')) { app.use(prefix + '/moderations', new ModerationService(moderationOptions(app)), { methods: ['create'], events: [] }); }
    if (allowedEntities.includes('files')) {
      app.use(prefix + '/files', new FileService(fileOptions(app)), { methods: ['create', 'find', 'get', 'remove'], events: [] });
      app.use(prefix + '/files/:id/content', new FileContentService(fileOptions(app)), { methods: ['find'], events: [] });
    }
  };
};
