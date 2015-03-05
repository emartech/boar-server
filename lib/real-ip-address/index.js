'use strict';


var getLastIpAddress = function(forwardedHeader) {
  return forwardedHeader.split(',').pop().replace(/\/.*/gi, '');
};


var getRemoteAddress = function(connection) {
  if (!connection) return;
  return connection.remoteAddress;
};


module.exports = function(request) {
  var forwardedHeader = request.headers['x-forwarded-for'];

  if (forwardedHeader) return getLastIpAddress(forwardedHeader);
  return getRemoteAddress(request.connection);
};