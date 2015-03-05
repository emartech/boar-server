'use strict';

var expect = require('chai').expect;
var maskEmailAddress = require('./');


describe('Mask Email Address', function () {

  [
    { email: 'test.email.address@emarsys.co.uk', masked: 't***s@emarsys.co.uk' },
    { email: 'dr.vi@emarsys.co.uk', masked: 'd***i@emarsys.co.uk' },
    { email: 'ab@emarsys.co.uk', masked: 'a***b@emarsys.co.uk' },
    { email: 'c@emarsys.co.uk', masked: 'c***c@emarsys.co.uk' }
  ].forEach(function (testCase) {
      it('should display the first and last character before the @ sign (' + testCase.email + ')', function () {
        var masked = maskEmailAddress(testCase.email);

        expect(masked).to.eql(testCase.masked);
      });
    });


  it('should return with undefined if the given parameter is falsy', function () {

    [undefined, false, null].forEach(function (falsyValue) {
      var masked = maskEmailAddress(falsyValue);

      expect(masked).to.eql(undefined);
    });

  });

});
