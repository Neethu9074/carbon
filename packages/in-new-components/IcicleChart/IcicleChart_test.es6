/* eslint-env mocha, node */
import { fromJS } from 'immutable';
import { expect } from 'chai';

import { applyLayout } from './IcicleLayout.es6';

describe('in-new-components/IcicleChart', () => {
  describe('Layout', () => {
    it('root span with no children', () => {
      let rootSpan = fromJS({
        id: '1',
        label: 'span',
        start: 0,
        duration: 10
      });

      const spanFrames = applyLayout(rootSpan);

      expect(spanFrames.toJS()).to.deep.include({
        id: '1',
        label: 'span',
        start: 0,
        duration: 10,
        parent: null,
        depth: 0,
        x: 0,
        y: 0,
        dx: 1,
        dy: 1
      });
    });

    it('synchronous spans', () => {
      let rootSpan = fromJS(require('./testData/syncSpans.es6').default);
      const spanFrames = applyLayout(rootSpan);

      expect(spanFrames.toJS()).to.deep.equal(require('./testData/syncSpans_expected.es6').default);
    });
  });
});
