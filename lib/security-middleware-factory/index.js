'use strict';

const _ = require('lodash');
const helmet = require('koa-helmet');

class SecurityMiddlewareFactory {

  constructor(options) {
    this._config = _.merge({}, this.defaultConfig, options);
  }

  get defaultConfig() {
    return {
      csp: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'"],
          frameAncestors: ["'self'"],
          reportUri: 'about:blank'
        },
        reportOnly: true
      },
      hsts: {
        maxAge: 30,
        includeSubDomains: true,
        preload: false
      },
      useXssFilter: true,
      useNoSniff: true
    };
  }

  getCspMiddleware() {
    return helmet.contentSecurityPolicy(this._config.csp);
  }

  getHstsMiddleware() {
    return helmet.hsts(this._config.hsts);
  }

  getXssFilterMiddleware() {
    return helmet.xssFilter();
  }

  getNoSniffMiddleware() {
    return helmet.noSniff();
  }

  getMiddlewares() {
    let middlewares = [
      this.getCspMiddleware(),
      this.getHstsMiddleware()
    ];

    if (this._config.useXssFilter) {
      middlewares.push(this.getXssFilterMiddleware());
    }

    if (this._config.useNoSniff) {
      middlewares.push(this.getNoSniffMiddleware());
    }

    return middlewares;
  }
}

module.exports = SecurityMiddlewareFactory;
