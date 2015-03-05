# boar-stack https://codeship.com/projects/b2e179d0-a54b-0132-cbce-72e52541da30/status?branch=master

## Example usage for app

put these lines in your server.js

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

## Add middleware for your app

  var cors = require('koa-cors');
  var app = new App(koaApp);
  app.addMiddleware(cors());


## Lib

### Mask email address

  var masEmailAddress = require('js-stack').lib.maskEmailAddress;
  masEmailAddress('test@gmail.com');

### Real ip address (in heroku)

  var realIpAddress = require('js-stack').lib.realIpAddress;
  realIpAddress(request);

### ControllerFactory

  var ControllerFactory = require('js-stack.lib.controllerFactory');

  module.exports = ControllerFactory.create(function(router) {
    router.get('/', ControllerFactory.load('main/actions/get'));
    router.get('/healthcheck', ControllerFactory.load('main/actions/healthcheck/get'));
    router.get('/list', ControllerFactory.loadByAcceptType('main/actions/list/get'));
  });

### Exception Handler
