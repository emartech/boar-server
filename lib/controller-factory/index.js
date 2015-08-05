'use strict';

var Router = require('koa-router');
var path = require('path');
var appRoot = require('app-root-path');

var ControllerFactory = function() {};

ControllerFactory.load = function(pathToAction) {
  return require(path.join(appRoot + '/controllers', pathToAction));
};

ControllerFactory.loadByAcceptType = function(pathToAction) {
  return function* () {
    var ext = this.accepts(['json', 'html']) === 'html' ? 'html' : 'json';
    var action = ControllerFactory.load(pathToAction + '.' + ext);

    yield action;
  };
};


ControllerFactory.create = function(routerBinding) {

  var Controller = function() {
    this._router = null;
  };

  Controller.prototype = {

    bindRouter: function(router) {
      this._router = router;
      routerBinding(router);
    },


    getMiddleware: function() {
      return this._router.middleware();
    }

  };

  var controllerMiddleware = function(app) {
    var controller = new Controller();
    controller.bindRouter(new Router());
    app.use(controller.getMiddleware());
  };

  controllerMiddleware.Controller = Controller;
  controllerMiddleware.Factory = ControllerFactory;

  return controllerMiddleware;
};


module.exports = ControllerFactory;
