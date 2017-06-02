'use strict';

module.exports = {

  app: require('./app'),

  middlewares: {
    hook: require('./app/middlewares/hook')
  },

  lib: {
    controllerFactory: require('./lib/controller-factory'),
    realIpAddress: require('./lib/real-ip-address'),
    Database: require('./lib/database'),
    maskEmailAddress: require('./lib/mask-email-address'),
    exceptionHandler: require('./lib/exception-handler'),
    clearCollections: require('./lib/clear-collections'),
    truncateCollections: require('./lib/truncate-collections'),
    clearGridfs: require('./lib/clear-gridfs'),
    securityMiddlewareFactory: require('./lib/security-middleware-factory')
  }

};
