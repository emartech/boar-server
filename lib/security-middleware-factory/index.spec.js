'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const helmet = require('koa-helmet');
const SecurityMiddlewareFactory = require('./');

describe('Security Middleware Factory', function() {

  let sandbox;

  beforeEach(function() {
    sandbox = sinon.createSandbox();

    sandbox.spy(helmet, 'contentSecurityPolicy');
    sandbox.spy(helmet, 'hsts');
    sandbox.spy(helmet, 'xssFilter');
    sandbox.spy(helmet, 'noSniff');
  });


  afterEach(function() {
    sandbox.restore();
  });


  describe('#getCspMiddleware', function() {

    describe('with no option specified', function() {

      it('should create the contentSecurityPolicy middleware with default config', function() {
        let securityMiddlewareFactory = new SecurityMiddlewareFactory();
        securityMiddlewareFactory.getCspMiddleware();

        expect(helmet.contentSecurityPolicy.calledWith(securityMiddlewareFactory.defaultConfig.csp)).to.be.ok;
      });
    });


    describe('with specified configuration', function() {

      it('should create the contentSecurityPolicy middleware with the merged configuration', function() {
        let securityMiddlewareFactory = new SecurityMiddlewareFactory({
          csp: {
            directives: {
              reportUri: 'http://my-report-uri.com'
            }
          }
        });

        let expectedConfiguration = securityMiddlewareFactory.defaultConfig.csp;
        expectedConfiguration.directives.reportUri = 'http://my-report-uri.com';

        securityMiddlewareFactory.getMiddlewares();

        expect(helmet.contentSecurityPolicy.calledWith(expectedConfiguration)).to.be.ok;
      });
    });
  });


  describe('#getHstsMiddleware', function() {

    describe('with no option specified', function() {

      it('should create the hsts middleware with default config', function() {
        let securityMiddlewareFactory = new SecurityMiddlewareFactory();
        securityMiddlewareFactory.getHstsMiddleware();

        expect(helmet.hsts.calledWith(securityMiddlewareFactory.defaultConfig.hsts)).to.be.ok;
      });
    });


    describe('with specified configuration', function() {

      it('should create the HSTS middleware with the merged configuration', function() {
        let securityMiddlewareFactory = new SecurityMiddlewareFactory({
          hsts: {
            maxAge: 10886400
          }
        });

        let expectedConfiguration = securityMiddlewareFactory.defaultConfig.hsts;
        expectedConfiguration.maxAge = 10886400;

        securityMiddlewareFactory.getMiddlewares();

        expect(helmet.hsts.calledWith(expectedConfiguration)).to.be.ok;
      });
    });
  });


  describe('#getMiddlewares', function() {

    beforeEach(function() {
      sandbox.restore();

      sandbox.stub(helmet, 'contentSecurityPolicy').returns('contentSecurityPolicy');
      sandbox.stub(helmet, 'hsts').returns('hsts');
      sandbox.stub(helmet, 'xssFilter').returns('xssFilter');
      sandbox.stub(helmet, 'noSniff').returns('noSniff');
    });


    describe('with no options specified', function() {

      it('should return all middlewares', function() {

        expect(new SecurityMiddlewareFactory().getMiddlewares()).to.eql([
          'contentSecurityPolicy', 'hsts', 'xssFilter', 'noSniff'
        ]);
      });

    });


    describe('with middlewares turned off', function() {

      it('should not return the xssFilter middleware when it is disabled', function() {
        expect(new SecurityMiddlewareFactory({ useXssFilter: false }).getMiddlewares()).to.not.contains('xssFilter');
      });


      it('should not return the noSniff middleware when it is disabled', function() {
        expect(new SecurityMiddlewareFactory({ useNoSniff: false }).getMiddlewares()).to.not.contains('noSniff');
      });
    });
  });
});
