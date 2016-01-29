'use strict';

var expect = require('chai').expect;
var errorHandler = require('./error-handler');

describe('Error Handler Middleware', function() {

  const DEFAULT_ERROR_MESSAGE = 'We\'re sorry, but something went wrong';
  const UNAUTHORIZED_ERROR_MESSAGE = 'We\'re sorry, but You are not authorized to take this action';
  const ERROR_PAGE_PATH = 'path/to/error/page';

  let fakeContext;
  let nextError = function* () { throw new Error() };

  beforeEach(function() {
    fakeContext = {
      renderArgs: {
        path: null,
        data: null
      },

      body: '',

      is: function() {
        return false;
      },

      render: function(path, data) {
        this.renderArgs.path = path;
        this.renderArgs.data = data;
      }
    }
  });

  it('should render error page if specified', function* () {
    var middleware = errorHandler(ERROR_PAGE_PATH);

    yield middleware.call(fakeContext, nextError);

    expect(fakeContext.renderArgs.path).to.eql(ERROR_PAGE_PATH);
    expect(fakeContext.renderArgs.data).to.eql({ message: DEFAULT_ERROR_MESSAGE });
  });

  it('should render error to request body if no error page path specified', function* () {
    var middleware = errorHandler();

    yield middleware.call(fakeContext, nextError);

    expect(fakeContext.body).to.eql(DEFAULT_ERROR_MESSAGE);
  });

  ['code', 'status'].forEach(propertyName => {

    describe(`error ${propertyName} is 401`, function () {

      it('should render unauthorized message to request body if no error page path specified', function* () {
        var middleware = errorHandler();
        let unauthorizedError = function* () {
          let error = new Error();
          error[propertyName] = 401;
          throw error;
        };

        yield middleware.call(fakeContext, unauthorizedError);

        expect(fakeContext.body).to.eql(UNAUTHORIZED_ERROR_MESSAGE);
      });

      it('should render unauthorized message to error page if specified', function* () {
        var middleware = errorHandler();
        let unauthorizedError = function* () {
          let error = new Error();
          error[propertyName] = 401;
          throw error;
        };

        yield middleware.call(fakeContext, unauthorizedError);

        expect(fakeContext.body).to.eql(UNAUTHORIZED_ERROR_MESSAGE);
      });

    });

  });

});

