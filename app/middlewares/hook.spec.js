'use strict';

var expect = require('chai').expect;
var hook = require('./hook');

describe('Hook Middleware', function() {

  describe('#getMiddleware', function() {

    it('should call next', function* () {
      var middleware = hook.getMiddleware();
      var called = false;
      var next = function* () { called = true; };

      yield middleware(next);

      expect(called).to.eql(true);
    });


    it('should call the given hook', function* () {
      var middleware = hook.getMiddleware();
      var called = false;
      var hookSpy = function () { called = true; };

      hook.add(hookSpy);
      yield middleware(function* () {});

      expect(called).to.eql(true);
    });


    it('should call the hooks in the given order before next', function* () {
      var middleware = hook.getMiddleware();
      var called = [];
      var next = function* () { called.push('next'); };
      var hookSpy1 = function() { called.push('hookSpy1'); };
      var hookSpy2 = function() { called.push('hookSpy2'); };

      hook.add(hookSpy1);
      hook.add(hookSpy2);
      yield middleware(next);

      expect(called).to.eql(['hookSpy1', 'hookSpy2',  'next']);
    });


    it('should call the given hook in the context of the middleware', function* () {
      var context = {};
      var middleware = hook.getMiddleware();
      var calledwith = null;
      var hookSpy = function() { calledwith = this; };

      hook.add(hookSpy);
      yield middleware.call(context, function* () {});

      expect(calledwith).to.equal(context);
    });

  });

  describe('#reset', function() {

    it('should remove all the hooks', function* () {
      var middleware = hook.getMiddleware();
      var called = false;
      var hookSpy = function () { called = true; };

      hook.add(hookSpy);
      hook.reset();
      yield middleware(function* () {});

      expect(called).to.eql(false);
    });

  });

});
