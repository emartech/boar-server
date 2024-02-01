'use strict';

var expect = require('chai').expect;
var handleException = require('./');
const co = require('co');

describe('Exception handler', function() {
  var CustomError, CustomErrorAlt, error;

  beforeEach(function() {
    CustomError = createError('CustomError');
    CustomErrorAlt = createError('CustomErrorAlt');
    error = new CustomError('Custom error');
  });

  it('should delegate an unhandled error', function() {
    try {
      handleException(error, {
        type: CustomErrorAlt,
        execute: function() {}
      });
    } catch(ex) {
      return expect(ex).to.be.eql(error);
    }

    throw new Error('Error expected');
  });


  it('should handle error if type matches a handled error', function(done) {
    handleException(error, {
      type: CustomError,
      execute: function(err) {
        expect(err).to.be.eql(error);
        done();
      }
    });
  });


  it('should use only the matched error handler', function(done) {
    var invalidHandler = { type: CustomErrorAlt, execute: function() {}};
    var validHandler = { type: CustomError, execute: function() { done(); }};
    handleException(error, invalidHandler, validHandler);
  });


  it('should run only the first handler if multiple handlers are matches to the exception', function() {
    var validHandler = { type: CustomError, execute: function() {}};
    var invalidHandler = {
      type: CustomError,
      execute: function() {
        throw new Error('Invalid handler used');
      }
    };

    handleException(error, validHandler, invalidHandler);
  });



  describe('error code provided', function() {
    beforeEach(function() {
      error.code = 400;
    });

    it('should handle error only if error code matches', function(done) {
      var invalidHandler = { code: 401, execute: function() {} };
      var validHandler = {
        code: 400,
        execute: function(err) {
          expect(err).to.be.eql(error);
          done();
        }
      };

      handleException(error, invalidHandler, validHandler);
    });


    it('should handle error by type and code if both provided', function(done) {
      var invalidHandler1 = { type: CustomError, code: 401, execute: function() {} };
      var invalidHandler2 = { type: CustomErrorAlt, code: 400, execute: function() {} };
      var validHandler = { type: CustomError, code: 400, execute: function() { done(); } };
      handleException(error, invalidHandler1, invalidHandler2, validHandler);
    });

  });



  describe('reply code provided', function() {
    beforeEach(function() {
      error.replyCode = 400;
    });

    it('should handle error only if reply code matches', function(done) {
      var invalidHandler = { replyCode: 401, execute: function() {} };
      var validHandler = {
        replyCode: 400,
        execute: function(err) {
          expect(err).to.be.eql(error);
          done();
        }
      };

      handleException(error, invalidHandler, validHandler);
    });

  });



  describe('returnHandler parameter provided', function() {

    it('should returns the matching handler instead of running it', function(done) {
      var returnedFunction = function() { done(); };

      var matchedFunction = handleException(error, true, {
        type: CustomError,
        execute: returnedFunction
      });

      matchedFunction();
    });


    it('could be used with yield', function (done) {
      co(function* () {
        var returnedFunction = function*() { done(); };

        yield handleException(error, true, {
          type: CustomError,
          execute: returnedFunction
        })();
      });
    });


    it('should delegate exceptions on yield context as well', co.wrap(function* () {
      try {
        yield handleException(error, true, {
          replyCode: 8002,
          execute: function*() {}
        })();
      } catch(ex) {
        return expect(ex).to.be.eql(error);
      }

      throw new Error('Unexpected error');
    }));
  });

});

function createError(errorName) {
  var NewError = function(message, code) {
    this.message = message;
    this.name = errorName;
    this.code = code;
  };

  NewError.prototype = new Error();
  return NewError;
}

