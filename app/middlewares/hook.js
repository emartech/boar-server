'use strict';


var hooks = [];

module.exports = {

  getMiddleware: function() {
    return function* (next) {
      hooks.forEach(function(hook) {
        hook.call(this);
      }, this);

      yield next;
    }
  },


  add: function(hook) {
    hooks.push(hook);
  },


  reset: function() {
    hooks = [];
  }

};
