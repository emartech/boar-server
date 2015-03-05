'use strict';

var expect = require('chai').expect;
var realIpAddress = require('./');

describe('Real Ip Address', function() {

  describe('without forwarded header', function() {

    [{
      name: 'connection is null',
      request: {
        connection: null,
        headers: []
      },
      expected: undefined
    }, {
      name: 'connection has a remote address',
      request: {
        connection: { remoteAddress: '123.12.12.15' },
        headers: []
      },
      expected: '123.12.12.15'
    }]
    .forEach(function(testCase) {

      it(testCase.name + ' should return with the connections remote adddress', function() {
        expect(realIpAddress(testCase.request)).to.eql(testCase.expected);
      });

    });

  });

  describe('with forwarded header', function() {

    [{
      name: 'forwarded header is set',
      request: {
        connection: null,
        headers: { 'x-forwarded-for': '31.115.111.92'}
      },
      expected: '31.115.111.92'
    }, {
      name: 'multiple forwarded header is set',
      request: {
        connection: null,
        headers: { 'x-forwarded-for': '37.220.141.131,31.115.111.92'}
      },
      expected: '31.115.111.92'
    }, {
      name: 'forwarded header and the connection is set',
      request: {
        connection: { remoteAddress: '123.12.12.15' },
        headers: { 'x-forwarded-for': '31.115.111.92'}
      },
      expected: '31.115.111.92'
    }, {
      name: 'forwarded header is set with extra options',
      request: {
        connection: null,
        headers: { 'x-forwarded-for': '31.115.111.92/NX' }
      },
      expected: '31.115.111.92'
    }]
    .forEach(function(testCase) {

      it(testCase.name + ' should return with the forwarded header\'s address', function() {
        expect(realIpAddress(testCase.request)).to.eql(testCase.expected);
      });

    });

  });

});
