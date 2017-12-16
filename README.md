# node-esi-server
Edge Side Includes (ESI) html fragment http server

This node server aims at rendering templates with provided data using a template provider and a data provider.

Supported template providers:

 * [nunjucks](https://github.com/petitchevalroux/node-esi-server-template-nunjucks)

## Install
```
npm install --save esi-server
```

## Usage

### Using the nunjucks template provider

```javascript
const TemplateProvider = require("esi-server-template-nunjucks"),
    nunjucks = TemplateProvider.nunjucks,
    {Server} = require("esi-server"),
    templateProvider = new TemplateProvider();
app = new Server({
    templateProvider: templateProvider
});
// Listen request from port 3000 TCP port
app.listen(3000);
```

## Sample queries
Each query must have a JSON string object with two properties :

 * **data** property is used as arguments of data provider get function
 * **tpl** property is used as arguments of template provider get function

```
GET /fragment?{"data":["/articles/1"],"tpl":["article.html",{"titleTag":"h1"}]}
```

```
GET /fragment?{"data":["/articles",{"order":"publishedAt","limit":10}],"tpl":["articles.html",{"title":"Last published articles"}]}
```

```
GET /fragment?{"tpl":["header.html",{"title":"Last published articles"}]}
```
