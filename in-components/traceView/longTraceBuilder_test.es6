/* eslint-env mocha, node */

import {expect} from 'chai';

import {transform} from 'in-components/traceView/longTraceBuilder';

describe('in-components/traceView/longStackTraceBuilder', () => {
  testFile('simpleTrace');
  testFile('networkCallToServer');

  function testFile(name) {
    it(`must translate ${name} content to long trace`, () => {
      const given = require(`./longTraceBuilderTestData/${name}_given.es6`).default;
      const expected = require(`./longTraceBuilderTestData/${name}_expected.es6`).default;
      expect(transform(given)).to.deep.equal(expected);
    });
  }
});
