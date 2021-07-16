/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { expect } from 'chai';

import { isOverlappedWith } from 'in-applications/analyze/components/TraceDetails/components/IcicleChart/TimeRangeHelper';
import { applyLayout } from 'in-applications/analyze/components/TraceDetails/components/IcicleChart/IcicleLayout';
/* eslint-env jest, node */
import { deepFreeze } from 'in-services/util/object';

describe('in-applications/analyze/components/TraceDetails/components/IcicleChart', () => {
  describe('Time Range Helper', () => {
    it('before existing ranges should not return false', () => {
      expect(
        isOverlappedWith(
          [1, 2],
          [
            [3, 4],
            [5, 6]
          ]
        )
      ).to.equal(false);
    });

    it('after existing ranges should not return false', () => {
      expect(
        isOverlappedWith(
          [7, 8],
          [
            [3, 4],
            [5, 6]
          ]
        )
      ).to.equal(false);
    });

    it('between existing ranges should return false', () => {
      expect(
        isOverlappedWith(
          [3, 4],
          [
            [1, 2],
            [5, 6]
          ]
        )
      ).to.equal(false);
    });

    it('inside existing ranges should return true', () => {
      expect(
        isOverlappedWith(
          [3, 4],
          [
            [1, 5],
            [7, 8]
          ]
        )
      ).to.equal(true);
    });

    it('overlap existing ranges should return true', () => {
      expect(isOverlappedWith([1, 4], [[3, 5]])).to.equal(true);
      expect(isOverlappedWith([3, 5], [[1, 4]])).to.equal(true);
    });

    it('equal to existing ranges should return true', () => {
      expect(isOverlappedWith([1, 4], [[1, 4]])).to.equal(true);
    });

    it('contains existing ranges should return true', () => {
      expect(isOverlappedWith([1, 5], [[2, 3]])).to.equal(true);
    });
  });

  describe('Icicle Layout', () => {
    it('root call with no children', () => {
      let rootCall = deepFreeze({
        id: '1',
        label: 'call',
        start: 0,
        duration: 10
      });

      const callFrames = applyLayout(rootCall);
      expect(callFrames).to.deep.include({
        id: '1',
        label: 'call',
        start: 0,
        duration: 10,
        parent: null,
        depth: 0,
        x: 0,
        dx: 1,
        totalDuration: 10,
        traceStart: 0,
        children: []
      });
    });

    it('0 duration call', () => {
      let rootCall = deepFreeze(require('./testData/0durationCalls.js').default);
      const callFrames = applyLayout(rootCall);

      const expectedCallFrames = require('./testData/0durationCalls_expected.js').default;
      expect(callFrames).to.deep.equal(expectedCallFrames);
    });

    it('synchronous call', () => {
      let rootCall = deepFreeze(require('./testData/syncCalls.js').default);
      const callFrames = applyLayout(rootCall);

      const expectedCallFrames = require('./testData/syncCalls_expected.js').default;
      expect(callFrames).to.deep.equal(expectedCallFrames);
    });

    it('asynchronous call case 1', () => {
      let rootCall = deepFreeze(require('./testData/asyncCalls1.js').default);
      const callFrames = applyLayout(rootCall);

      const expectedCallFrames = require('./testData/asyncCalls1_expected.js').default;
      expect(callFrames).to.deep.equal(expectedCallFrames);
    });

    it('asynchronous call case 2', () => {
      let rootCall = deepFreeze(require('./testData/asyncCalls2.js').default);
      const callFrames = applyLayout(rootCall);

      const expectedCallFrames = require('./testData/asyncCalls2_expected.js').default;
      expect(callFrames).to.deep.equal(expectedCallFrames);
    });

    it('asynchronous call case 3', () => {
      let rootCall = deepFreeze(require('./testData/asyncCalls3.js').default);
      const callFrames = applyLayout(rootCall);

      const expectedCallFrames = require('./testData/asyncCalls3_expected.js').default;
      expect(callFrames).to.deep.equal(expectedCallFrames);
    });

    it('child calls outside of the root call', () => {
      let rootCall = deepFreeze(require('./testData/childCallsOutsideOfRootCall.js').default);
      const callFrames = applyLayout(rootCall);

      const expectedCallFrames = require('./testData/childCallsOutsideOfRootCall_expected.js').default;
      expect(callFrames).to.deep.equal(expectedCallFrames);
    });

    it('child calls with same start and 0 duration', () => {
      let rootCall = deepFreeze(require('./testData/0durationCallsSameStart.js').default);
      const callFrames = applyLayout(rootCall);

      const expectedCallFrames = require('./testData/0durationCallsSameStart_expected.js').default;
      expect(callFrames).to.deep.equal(expectedCallFrames);
    });
  });
});
