/* eslint-env mocha, node */

import Immutable from 'immutable';
import {expect} from 'chai';

import {compress} from 'in-components/traceView/longTraceCompressor';
import {transform} from 'in-components/traceView/longTraceBuilder';

describe('in-components/traceView', () => {

  describe('longTraceBuilder', () => {
    testFile('simpleTrace', transformToLongStackTrace);
    testFile('networkCallToServer', transformToLongStackTrace);
    testFile('withStackTrace', transformToLongStackTrace);
    testFile('withStackTraceAndCommonRoot', transformToLongStackTrace);

    function transformToLongStackTrace(given) {
      return transform(Immutable.fromJS(given));
    }
  });

  describe('longTraceCompressor', () => {
    testFile('compression', compressLongStackTrace);

    function compressLongStackTrace(given) {
      return compress(given);
    }
  });


  function testFile(name, givenToActual) {
    it(`must translate ${name} content to long trace`, () => {
      const given = require(`./longTraceTestData/${name}_given.es6`).default;
      const expected = require(`./longTraceTestData/${name}_expected.es6`).default;
      const actual = givenToActual(given);
      expect(removeSpanAndStacktraceDetails(actual))
        .to.deep.equal(expected, `Actual: ${JSON.stringify(actual, 0, 2)}`);
    });
  }

  function removeSpanAndStacktraceDetails(tree) {
    delete tree.span;
    delete tree.stackTrace;
    delete tree.spans;
    delete tree.parentSpan;
    tree.children.forEach(removeSpanAndStacktraceDetails);
    return tree;
  }
});
