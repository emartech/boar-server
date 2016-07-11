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
var requestId = require('koa-requestid');
var ssl = require('koa-ssl');
var SecurityMiddlewareFactory = require('../lib/security-middleware-factory');


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
    fs.readdirSync(path).forEach(function(file) {
      var filePath = path + '/' + file + '/index.js';
      if (!fs.existsSync(filePath)) {
        return;
      }
      require(filePath)(this.koaApp);
    }.bind(this));
  },


  loadModels: function(path) {
    fs.readdirSync(path).forEach(function(file) {
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


  addRequestIdMiddleware: function(options) {
    options = options || { expose: 'x-request-id', header: 'x-request-id', query: 'x-request-id' };
    this.addMiddleware(requestId(options));
  },


  addSecurityMiddlewares: function(options) {
    new SecurityMiddlewareFactory(options)
      .getMiddlewares()
      .forEach(this.addMiddleware, this);
  },


  addEnforceSSLMiddleware: function(options) {
    this.addMiddleware(ssl(options));
  },


  listen: function(port, env) {
    var httpPort = parseInt(port);
    this._startHTTPServer(httpPort, env);

    if (process.env.SERVE_HTTPS === 'true') {
      var httpsPort = httpPort + 10000;
      this._startHTTPSServer(httpsPort, env);
    }
  },


  _startHTTPServer: function(port, env) {
    http.createServer(this.koaApp.callback()).listen(port);
    console.log('Application started:', { port: port, env: env });
  },


  _startHTTPSServer: function(port, env) {
    var httpsOptions = {};
    if (process.env.HTTPS_KEY && process.env.HTTPS_CERT) {
      httpsOptions.key = fs.readFileSync(process.env.HTTPS_KEY);
      httpsOptions.cert = fs.readFileSync(process.env.HTTPS_CERT);
    }

    https.createServer(httpsOptions, this.koaApp.callback()).listen(port);
    console.log('Application started (with SSL):', { port: port, env: env });
  }

};

module.exports = App;
