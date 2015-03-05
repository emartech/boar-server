'use strict';

var _ = require('lodash');

module.exports = function(emailAddress) {
  if (!emailAddress) return;
  var firstCharacter = _.first(emailAddress);
  var lastCharacter = _.last(emailAddress.split('@')[0]);

  return  firstCharacter + '***' + lastCharacter + '@' + emailAddress.replace(/^.*@/, '');
};