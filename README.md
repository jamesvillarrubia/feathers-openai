[![NPM](https://img.shields.io/npm/l/feathers-openai)](https://github.com/jamesvillarrubia/feathers-openai/blob/main/LICENSE) [![npm](https://img.shields.io/npm/v/feathers-openai?label=latest)](https://www.npmjs.com/package/feathers-openai)

  

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/jamesvillarrubia/feathers-openai/Node%20Lint%20&%20Test?label=build%20%26%20lint)

![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/feathers-openai)

![Download Status](https://img.shields.io/npm/dm/feathers-openai.svg)

# feathers-openai

> NOTE: This library is new and APIs may change as features stablize.  
### Introduction

This library enables a series of FeathersJS services that map to the entities and routes of the [OpenAI API](https://platform.openai.com/docs/api-reference/introduction).

By wrapping the API in a set of FeathersJS services, developers can quickly integrate any subset of the OpenAI API into their FeathersJS application. This enables the developer to log, manipulate, wrap hooks around, and make direct or indirect calls to the API.

### Motivation
Exposing OpenAI within a secure enterprise environment comes with inherent risk, given the likely high volume of text data that leaves your system. By consolidating OpenAI behind a Feathers service, we can get the benefits of both a secure proxy and the control that comes with individualized authentication and query filtering. Feathers-openai can be both a quick way to integrate OpenAI into an application as well as a quick way to scale an enterprise gateway to the OpenAI API with all of the benefits of FeathersJS baked in (Auth mgmt, API key mgmt, custom mutations and resolvers, etc.)

### Features
* All OpenAI routes get their own service (e.g. `openai/embeddings`)
* Nested routes are included (e.g.`openai/fine-tunes/:id/cancel`)
* Allows prefixing to prevent route overwriting (`/my-openai-prefix/models`)
* All OpenAI Services can be extended with normal hooks
* Allows for uploads via `multer`
* Light validation via TypeBox on all `create` calls.
* Can disable individual services via configuration

## Compatability
This library and the services included are tested against REST APIs for Feathers v5. The examples below demonstrate the use of uploads for KoaJS only, though Express is probably very similar. 

Additional testing and PRs are welcome.

| feathers  | v5                 | v4                 | v3              | 
|-----------|--------------------|--------------------|-----------------|
| express   | :white_check_mark: | :grey_question:    | :grey_question: |  
| koa       | :white_check_mark: | :grey_question:    | :grey_question: |  
| primus    | :grey_question:    | :grey_question:    | :grey_question: |
| socket.io | :grey_question:    | :grey_question:    | :grey_question: |


### Todo
- [x] - Integrate all routes with FeathersJS
- [x] - Incorporate uploads via buffer streams
- [x] - Document multer example with KoaJS
- [ ] - Document multer example with ExpressJS
- [x] - Testing for uploads
- [x] - Testing for configuration
- [x] - Testing for sample services
- [ ] - Expand testing to cover all services

> NOTE: PRs are welcome!

### Installation

To install the services, add the library as a dependency.
```bash
npm install --save feathers-openai multer @koa/multer
```  
In your `app.js` file, add the following middleware calls:
```javascript
import koamulter from '@koa/multer';
import { openaiMulter, openai } from 'feathers-openai';
app.use(koamulter().any());
app.use(openaiMulter);
```
The `koamulter` captures multi-part form uploads to your endpoints.  The `openaiMulter` appends the file(s) to the `ctx.feathers` object, making the buffers accessible within the hook and service `params`.  The `multer` library or equivalent is required by `koamulter`.  

In your `src/services/index.js` add the following:

```javascript
import { openai } from 'feathers-openai'

export const services = (app) => {
	app.configure(openai('openai'))
	//	... other services
}
```

### Configuration
__API Key in [env].json__

You must add your API key in your `/config/[env].json` file. 

```json
{
	"openai":"sk-XXXXXXXXXXXXXXXXXXXXXX"
}
```

__Service Options:__

- `prefix` (*optional*, default: `openai`) - The prefix added to every OpenAI service route.  This allows you to nest the services so that their common names (i.e. `model`, etc.) don't overwrite your core application services.  The default setting will result in routes like `openai/models` and `openai/fine-tunes`.
- `allowedEntities` (*optional*, default: all).  This option allows you to disable and prevent the loading of any of the OpenAI API routes and entities.  It takes an array of entity names.  For example, setting `allowedEntities=['models']` would enable only the `openai/models` service. This list of services are:
	- `models`
	- `edits`
	- `completions`
	- `images/generations`
	- `images/edits`
	- `images/variations`
	- `fine-tunes`
	- `embeddings`
	- `moderations`
	- `files`

### Adding Hooks

The services come with no hooks by default.  You can add hooks by simply setting the hooks property after `app.configure`.  For example:

```javascript
export const services = (app) => {
	app.configure(openai('openai'))
	attachOpenAIhooks(app)
	//	... other services
}
function attachOpenAIhooks(app){
	app.service('openai/models).hooks({
		before:{
			all:[()=>console.log('in the models hook!')]
		}
	})
}
```

You can also directly leverage the service as part of another service flow, like using the AI to write a title for an article.

 
```javascript
app.service('articles').hooks({
	before:{ create:[
		(ctx)=>{
			let text = ctx.data.text;
			ctx.data.title = ctx.app.service('openai/completions)
			.create({
				model: "text-davinci-003",
				prompt: `Write a clickbait title for the following text:\n${text}\n####`,
				max_tokens: 7,
				temperature: 0,
				stop:'###'
			}).then(r=>r.choices[0].text)
		}]
	}
})
```


### Known Limitations
__Adapter Syntax:__ `feathers-openai` does NOT implement the [Feathers Common database adapter API](https://docs.feathersjs.com/api/databases/common.html) 

__Pagination:__  The current OpenAI API does not demonstrate how they will provide pagination for large responses, so for `find` method calls, the `total`, `$limit` and `$skip` are server-side manipulations of the OpenAI response and will not reduce the call on the OpenAI side.   Any calls to `find` will return the standard feathers object `{ total:x ... data:[...]}` but `create` , `get`, `remove`,`update` will return as close to the original OpenAI response.  

__Queries/Search:__ There is NO query capability for the OpenAI API so it is not implemented here.  This library does not implement the FeathersJS [querying syntax](https://docs.feathersjs.com/api/databases/querying.html). 