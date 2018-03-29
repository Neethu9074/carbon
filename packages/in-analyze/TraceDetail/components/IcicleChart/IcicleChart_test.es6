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
    it('root span with no children', () => {
      let rootSpan = deepFreeze({
        id: '1',
        label: 'span',
        start: 0,
        duration: 10
      });

      const spanFrames = applyLayout(rootSpan);

      expect(spanFrames).to.deep.include({
        id: '1',
        label: 'span',
        start: 0,
        duration: 10,
        parent: null,
        depth: 0,
        x: 0,
        dx: 1
      });
    });

    it('synchronous spans', () => {
      let rootSpan = deepFreeze(require('./testData/syncSpans.es6').default);
      const spanFrames = applyLayout(rootSpan);

      const expectedSpanFrames = require('./testData/syncSpans_expected.es6').default;
      expect(spanFrames).to.deep.equal(expectedSpanFrames);
    });

    it('asynchronous spans case 1', () => {
      let rootSpan = deepFreeze(require('./testData/asyncSpans1.es6').default);
      const spanFrames = applyLayout(rootSpan);

      const expectedSpanFrames = require('./testData/asyncSpans1_expected.es6').default;
      expect(spanFrames).to.deep.equal(expectedSpanFrames);
    });

    it('asynchronous spans case 2', () => {
      let rootSpan = deepFreeze(require('./testData/asyncSpans2.es6').default);
      const spanFrames = applyLayout(rootSpan);

      const expectedSpanFrames = require('./testData/asyncSpans2_expected.es6').default;
      expect(spanFrames).to.deep.equal(expectedSpanFrames);
    });

    it('asynchronous spans case 3', () => {
      let rootSpan = deepFreeze(require('./testData/asyncSpans3.es6').default);
      const spanFrames = applyLayout(rootSpan);

      const expectedSpanFrames = require('./testData/asyncSpans3_expected.es6').default;
      expect(spanFrames).to.deep.equal(expectedSpanFrames);
    });
  });
});
