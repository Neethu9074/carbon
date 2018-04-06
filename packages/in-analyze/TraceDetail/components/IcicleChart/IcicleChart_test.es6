/* eslint-env mocha, node */
import { deepFreeze } from 'in-services/util/object';
import { expect } from 'chai';

import { isOverlappedWith } from 'in-analyze/TraceDetail/components/IcicleChart/TimeRangeHelper';
import { applyLayout } from 'in-analyze/TraceDetail/components/IcicleChart/IcicleLayout';

describe('in-analyze/TraceDetail/components/IcicleChart', () => {
  describe('Time Range Helper', () => {
    it('before existing ranges should not return false', () => {
      expect(isOverlappedWith([1, 2], [[3, 4], [5, 6]])).to.equal(false);
    });

    it('after existing ranges should not return false', () => {
      expect(isOverlappedWith([7, 8], [[3, 4], [5, 6]])).to.equal(false);
    });

    it('between existing ranges should return false', () => {
      expect(isOverlappedWith([3, 4], [[1, 2], [4, 5]])).to.equal(false);
    });

    it('inside existing ranges should return true', () => {
      expect(isOverlappedWith([3, 4], [[1, 5], [7, 8]])).to.equal(true);
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
        dx: 1
      });
    });

    it('synchronous call', () => {
      let rootCall = deepFreeze(require('./testData/syncCalls.es6').default);
      const callFrames = applyLayout(rootCall);

      const expectedCallFrames = require('./testData/syncCalls_expected.es6').default;
      expect(callFrames).to.deep.equal(expectedCallFrames);
    });

    it('asynchronous call case 1', () => {
      let rootCall = deepFreeze(require('./testData/asyncCalls1.es6').default);
      const callFrames = applyLayout(rootCall);

      const expectedCallFrames = require('./testData/asyncCalls1_expected.es6').default;
      expect(callFrames).to.deep.equal(expectedCallFrames);
    });

    it('asynchronous call case 2', () => {
      let rootCall = deepFreeze(require('./testData/asyncCalls2.es6').default);
      const callFrames = applyLayout(rootCall);

      const expectedCallFrames = require('./testData/asyncCalls2_expected.es6').default;
      expect(callFrames).to.deep.equal(expectedCallFrames);
    });

    it('asynchronous call case 3', () => {
      let rootCall = deepFreeze(require('./testData/asyncCalls3.es6').default);
      const callFrames = applyLayout(rootCall);

      const expectedCallFrames = require('./testData/asyncCalls3_expected.es6').default;
      expect(callFrames).to.deep.equal(expectedCallFrames);
    });
  });
});
