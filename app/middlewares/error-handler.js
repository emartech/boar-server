'use strict';

var logger = require('logentries-logformat')('app');

var renderError = function* (context, message) {
  if (context.is('application/json')) {
    context.body = { error: true, message: message };
  } else {
    yield context.render('main/error', { message: message });
  }
};

module.exports = function* (next) {
  try {
    yield next;
  } catch (ex) {
    if (ex.code === 401) {
      this.status = 401;
      yield renderError(this, 'We\'re sorry, but You are not authorized to take this action');
      logger.error('authentication', ex.message);
    } else {
      this.status = 500;
      yield renderError(this, 'We\'re sorry, but something went wrong');
      logger.error('internal', ex.message, { stack: ex.stack });
    }
  }
};
