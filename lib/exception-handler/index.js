'use strict';

var _ = require('lodash');

var ExceptionHandler = function(exception, returnHandler, handledExceptions) {
  this._exception = exception;
  this._handledExceptions = handledExceptions;
  this._handledException = null;
  this._returnHandler = returnHandler;
};

ExceptionHandler.prototype = {

  execute: function() {
    _.forEach(this._handledExceptions, _.bind(this._setHandledExceptionOnMatch, this));

    if (!this._handledException) this._delegateException();

    if (this._returnHandler) {
      return this._handledException.execute;
    }

    this._handledException.execute(this._exception);
  },


  _setHandledExceptionOnMatch: function(handledException) {
    if (!this._exceptionMatches(handledException)) return true;

    this._handledException = handledException;
    return false;
  },


  _exceptionMatches: function(handledException) {
    return this._typeMatches(handledException.type) &&
      this._codeMatches(handledException.code) &&
      this._replyCodeMatches(handledException.replyCode);
  },


  _typeMatches: function(type) {
    return !type || this._exception instanceof type;
  },


  _codeMatches: function(code) {
    return !code || this._exception.code === code;
  },


  _replyCodeMatches: function(replyCode) {
    return !replyCode || this._exception.replyCode === replyCode;
  },


  _delegateException: function() {
    throw this._exception;
  }

};


ExceptionHandler.create = function(exception, returnHandler) {
  var handledExceptions = _.toArray(arguments).slice(2);

  if (!_.isBoolean(returnHandler)) {
    handledExceptions.unshift(returnHandler);
    returnHandler = false;
  }

  return new ExceptionHandler(exception, returnHandler, handledExceptions).execute();
};

module.exports = ExceptionHandler.create;