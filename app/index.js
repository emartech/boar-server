'use strict';

var http = require('http');
var fs = require('fs');
var serve = require('koa-static');
var cors = require('koa-cors');
var jade = require('koa-jade');
var errorHandlerMiddleware = require('./middlewares/error-handler');
var methodOverride = require('koa-methodoverride');
var HookMiddlewareFactory = require('./middlewares/hook');
var bodyparser = require('koa-bodyparser');
var requestId = require('koa-request-id');


var App = function(koaApp) {
  this.koaApp = koaApp;
};

App.prototype = {

  addCorsSupportMiddleware: function() {
    this.addMiddleware(cors({
      origin: '*'
    }));
  },


  loadControllers: function(path) {
    fs.readdirSync(path).forEach(function (file) {
      var filePath = path + '/' + file + '/index.js';
      if (!fs.existsSync(filePath)) return;
      require(filePath)(this.koaApp);
    }.bind(this));
  },


  loadModels: function(path) {
    fs.readdirSync(path).forEach(function (file) {
      if (/(.*)\.(js$)/.test(file) && !/(.*)\.(spec.js$)/.test(file)) {
        require(path + '/' + file);
      }
    }.bind(this));
  },


  addMiddleware: function(middleware) {
    this.koaApp.use(middleware);
  },


  addStaticContentMiddleware: function(path) {
    this.addMiddleware(serve(path));
  },


  addDynamicViewMiddleware: function(root, cache) {
    this.addMiddleware(jade.middleware({
      viewPath: root,
      noCache: !cache
    }));
  },


  addHookMiddleware: function() {
    this.addMiddleware(HookMiddlewareFactory.getMiddleware());
  },


  addMethodOverrideMiddleware: function(fieldName) {
    this.addMiddleware(methodOverride(fieldName));
  },


  addErrorHandlerMiddleware: function(renderPath) {
    this.addMiddleware(errorHandlerMiddleware(renderPath));
  },


  addBodyParseMiddleware: function(options) {
    this.addMiddleware(bodyparser(options));
  },


  addRequestIdmiddleware: function() {
    this.addMiddleware(requestId());
  },


  listen: function(port, env) {
    var server = http.createServer(koaApp.callback()).listen(port)

    process.on('SIGTERM', function () {
      console.log('Starting graceful shutdown...')
      server.close(function (err) {
        if (err) {
          console.log('Graceful shutdown failed', err)
          process.exit(1)
        }
        console.log('Graceful shutdown succeeded')
        process.exit(0)
      })
    })

    console.log('Application started:', { port: port, env: env });
  }

};

module.exports = App;
