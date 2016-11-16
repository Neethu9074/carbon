/* eslint-env mocha, node */

import Immutable from 'immutable';
import {expect} from 'chai';

import {transform, withoutDuplicatatedStackTraceLines} from 'in-views/traceView/longTraceBuilder';
import {compress} from 'in-views/traceView/longTraceCompressor';

describe('in-views/traceView', () => {

  describe('longTraceBuilder', () => {
    describe('transformation', () => {
      testFile('simpleTrace', transformToLongStackTrace);
      testFile('networkCallToServer', transformToLongStackTrace);
      testFile('withStackTrace', transformToLongStackTrace);
      testFile('withStackTraceAndCommonRoot', transformToLongStackTrace);
      testFile('withStackTraceAndCommonRootFromEntrySpan', transformToLongStackTrace);
      testFile('withStackTraceAndTimeBasedMoving', transformToLongStackTrace);

      function transformToLongStackTrace(given) {
        return transform(Immutable.fromJS(given));
      }
    });

    describe('withoutDuplicatatedStackTraceLines', () => {
      it('must remove duplicate stack trace lines', () => {
        const span = Immutable.fromJS([
          {c: 'a', m: '', n: 1},
          {c: 'b', m: '', n: 2},
          {c: 'c', m: '', n: 3},
          {c: 'd', m: '', n: 4}
        ]);

        const parent = Immutable.fromJS([
          {c: 'b', m: '', n: 2}
        ]);

        expect(withoutDuplicatatedStackTraceLines(parent, span).map(v => v.toJS())).to.deep.equal([
          {c: 'a', m: '', n: 1}
        ]);
      });
    });
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
    delete tree.start;
    tree.children.forEach(removeSpanAndStacktraceDetails);
    return tree;
  }
});
