/* eslint-env mocha, node */

import Immutable from 'immutable';
import {expect} from 'chai';

import {transform} from 'in-components/traceView/longTraceBuilder';

describe('in-components/traceView/longStackTraceBuilder', () => {
  testFile('simpleTrace');
  testFile('networkCallToServer');
  testFile('withStackTrace');
  testFile('withStackTraceAndCommonRoot');

  function testFile(name) {
    it(`must translate ${name} content to long trace`, () => {
      const given = require(`./longTraceBuilderTestData/${name}_given.es6`).default;
      const expected = require(`./longTraceBuilderTestData/${name}_expected.es6`).default;
      const actual = transform(Immutable.fromJS(given));
      expect(removeSpanAndStacktraceDetails(actual))
        .to.deep.equal(expected, `Actual: ${JSON.stringify(actual, 0, 2)}`);
    });
  }

  function removeSpanAndStacktraceDetails(tree) {
    delete tree.span;
    delete tree.stackTrace;
    tree.children.forEach(removeSpanAndStacktraceDetails);
    return tree;
  }
});
