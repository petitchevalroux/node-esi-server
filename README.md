# node-esi-server
Edge Side Includes (ESI) fragment server

```
GET /fragment?{"data":["/articles/1"],"tpl":["/blog/article",{"titleTag":"h1"}]}
```

```
GET /fragment?{"data":["/articles",{"order":"publishedAt","limit":10}],"tpl":["/blog/articles",{"title":"Last published articles"}]}
```

```
GET /fragment?{"tpl":["/html5/header",{"title":"Last published articles"}]}
```