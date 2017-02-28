/* eslint-env mocha */

import {fromJS} from 'immutable';
import {expect} from 'chai';

import {getDepth, getCalls} from 'in-views/traceView/util';
import {SPAN_KINDS} from 'in-sdk/tracing';

describe('in-views/traceView/util', () => {
  describe('getDepth', () => {
    it('must not fail when there is only one level with an intermediate span', () => {
      const trace = fromJS({
        kind: SPAN_KINDS.INTERMEDIATE,
        childSpans: []
      });
      expect(getDepth(trace)).to.equal(1);
    });

    it('must calculate depth for ENTRY => EXIT => ENTRY traces', () => {
      const trace = fromJS({
        kind: SPAN_KINDS.ENTRY,
        childSpans: [
          {
            kind: SPAN_KINDS.EXIT,
            childSpans: [
              {
                kind: SPAN_KINDS.ENTRY,
                childSpans: []
              }
            ]
          }
        ]
      });
      expect(getDepth(trace)).to.equal(2);
    });
  });

  describe('getCalls', () => {
    it('must not fail when there is only one level with an intermediate span', () => {
      const trace = fromJS({
        kind: SPAN_KINDS.INTERMEDIATE,
        batchSize: 1,
        childSpans: []
      });
      expect(getCalls(trace)).to.equal(1);
    });

    it('must calculate depth for ENTRY => EXIT => ENTRY traces', () => {
      const trace = fromJS({
        kind: SPAN_KINDS.ENTRY,
        batchSize: 1,
        childSpans: [
          {
            kind: SPAN_KINDS.EXIT,
            batchSize: 1,
            childSpans: [
              {
                kind: SPAN_KINDS.ENTRY,
                batchSize: 1,
                childSpans: []
              }
            ]
          }
        ]
      });
      expect(getCalls(trace)).to.equal(2);
    });

    it('must use batch size for exit/intermediate root spans', () => {
      const trace = fromJS({
        kind: SPAN_KINDS.INTERMEDIATE,
        batchSize: 5,
        childSpans: []
      });
      expect(getCalls(trace)).to.equal(5);
    });
  });
});
