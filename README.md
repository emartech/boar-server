# Boar Server 

## Example usage for app

put these lines in your server.js
``` javascript
  var koa = require('koa');
  var path = require('path');
  var koaApp = module.exports = koa();
  var config = require('./config');
  var App = require('js-stack').app;

  var app = new App(koaApp);
  app.connectToMongoose(config.mongooseUri);
  app.addDynamicViewMiddleware(path.join(config.root, '/views'), config.env === 'development');
  app.addStaticContentMiddleware(path.join(config.root, '/assets'));
  app.addHookMiddleware();
  app.loadControllers(path.join(config.root, 'controllers'));
  app.loadModels(path.join(config.root, 'models'));

  if (!module.parent) { app.listen(config.port); }
```
## Add middleware for your app
``` javascript
  var cors = require('koa-cors');
  var app = new App(koaApp);
  app.addMiddleware(cors());
```

## Lib

### Mask email address
``` javascript

  var masEmailAddress = require('js-stack').lib.maskEmailAddress;
  masEmailAddress('test@gmail.com');
  
```
### Real ip address (in heroku)
``` javascript
  var realIpAddress = require('js-stack').lib.realIpAddress;
  realIpAddress(request);
```
### ControllerFactory
``` javascript
  var ControllerFactory = require('js-stack.lib.controllerFactory');

  module.exports = ControllerFactory.create(function(router) {
    router.get('/', ControllerFactory.load('main/actions/get'));
    router.get('/healthcheck', ControllerFactory.load('main/actions/healthcheck/get'));
    router.get('/list', ControllerFactory.loadByAcceptType('main/actions/list/get'));
  });
```

## HTTPS support
To enable HTTPS support, simple create `SERVE_HTTPS` environment variable with value `true`. The port for https will be the

If you want to serve the requests with your own SSL certification, create `HTTPS_KEY` and `HTTPS_CERT`
environment variables with path of the files as values.

### Example
```
export SERVE_HTTPS=true
export HTTPS_KEY="path/to/cert.key"
export HTTPS_CERT="path/to/cert.crt"

node server.js
```
