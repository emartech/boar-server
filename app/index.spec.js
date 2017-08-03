'use strict';

const http = require('http');
const https = require('https');
const expect = require('chai').expect;
const sinon = require('sinon');
const App = require('./');

let sandbox;

const createFakeServer = extensions => {
  const defaultFakeServer = {
    listen() {
      return this;
    },
    close: sandbox.stub()
  };
  return Object.assign(defaultFakeServer, extensions);
};

const createApp = () => new App({ callback: () => {} });

const tick = () => {
  return new Promise(resolve => setTimeout(resolve, 0));
};


describe('App', () => {

  let envSnapshot;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    envSnapshot = Object.assign({}, process.env);
  });

  afterEach(() => {
    sandbox.restore();
    process.env = envSnapshot;
  });

  describe('#close', () => {

    it('should close the running servers', function() {
      process.env.SERVE_HTTPS = 'true';
      const httpServer = createFakeServer();
      sandbox.stub(http, 'createServer').returns(httpServer);
      const httpsServer = createFakeServer();
      sandbox.stub(https, 'createServer').returns(httpsServer);
      const app = createApp();
      app.listen(3000);

      app.close();

      expect(httpServer.close).to.have.been.calledOnce;
      expect(httpsServer.close).to.have.been.calledOnce;
    });


    it('should return a promise that resolves after all servers had closed', function* () {
      process.env.SERVE_HTTPS = 'true';

      let httpServerClosedCallback;
      const httpServer = createFakeServer({ close: callback => httpServerClosedCallback = callback });
      sandbox.stub(http, 'createServer').returns(httpServer);

      let httpsServerClosedCallback;
      const httpsServer = createFakeServer({ close: callback => httpsServerClosedCallback = callback });
      sandbox.stub(https, 'createServer').returns(httpsServer);

      const app = createApp();
      app.listen(3000);

      let closeResolved = false;
      app.close().then(() => closeResolved = true);

      httpServerClosedCallback();
      yield tick();
      expect(closeResolved).to.be.false;

      httpsServerClosedCallback();
      yield tick();
      expect(closeResolved).to.be.true;
    });


    it('should not call close on already closed servers', function() {
      const httpServer = createFakeServer();
      sandbox.stub(http, 'createServer').returns(httpServer);
      const app = createApp();
      app.listen(3000);

      app.close();
      app.close();

      expect(httpServer.close).to.have.been.calledOnce;
    });

  });

});
