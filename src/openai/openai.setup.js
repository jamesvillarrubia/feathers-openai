import { Configuration, OpenAIApi } from 'openai';

export const openaiSetup = (app, service) => {
  const configuration = new Configuration({
    apiKey: app.get('openai')
  });
  service.client = new OpenAIApi(configuration);
};
