'use strict';

var fs = require('fs');
var http = require('http');
var https = require('https');
var serve = require('koa-static');
var cors = require('koa-cors');
var Jade = require('koa-jade');
var errorHandlerMiddleware = require('./middlewares/error-handler');
var methodOverride = require('koa-methodoverride');
var HookMiddlewareFactory = require('./middlewares/hook');
var bodyparser = require('koa-bodyparser');
var requestId = require('koa-request-id');
var sslify = require('koa-sslify');


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
    var jadeMiddleware = new Jade({
      viewPath: root,
      noCache: !cache
    });

    jadeMiddleware.use(this.koaApp);
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
    var httpPort = parseInt(port);
    var httpsPort = httpPort + 10000;

    http.createServer(this.koaApp.callback()).listen(httpPort);
    console.log('Application started:', { port: httpPort, env: env });

    if (process.env.SERVE_HTTPS === 'true') {
      var httpsOptions = {};
      if (process.env.HTTPS_KEY && process.env.HTTPS_CERT) {
        httpsOptions.key = fs.readFileSync(process.env.HTTPS_KEY);
        httpsOptions.cert = fs.readFileSync(process.env.HTTPS_CERT);
      }

      this.addMiddleware(sslify({ port: httpsPort }));

      https.createServer(httpsOptions, this.koaApp.callback()).listen(httpsPort);
      console.log('Application started (with SSL):', { port: httpsPort, env: env });
    }
  }

};

module.exports = App;
