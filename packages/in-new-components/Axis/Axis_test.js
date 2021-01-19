/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */
import { expect } from 'chai';

import { mapNormalizedTicks } from 'in-new-components/Axis/Axis';

describe('in-new-components/Axis', () => {
  describe('#mapNormalizedTicks', () => {
    it('should map normalized ticks to scale', () => {
      const scale = { from: 200, to: 400 };
      const tickPositions = [0, 0.5, 1];
      const roundTickPositions = false;
      const mappedTicks = mapNormalizedTicks(scale, tickPositions, roundTickPositions, 400);

      expect(mappedTicks[0]).to.deep.equal({ range: 0, domain: 200 });
      expect(mappedTicks[1]).to.deep.equal({ range: 200, domain: 300 });
      expect(mappedTicks[2]).to.deep.equal({ range: 400, domain: 400 });
    });

    it('should void multiple ticks when rounded', () => {
      const scale = { from: 0, to: 2 };
      const tickPositions = [0, 0.33, 0.66, 1];
      const roundTickPositions = true;
      const mappedTicks = mapNormalizedTicks(scale, tickPositions, roundTickPositions, 400);

      expect(mappedTicks[0]).to.deep.equal({ range: 0, domain: 0 });
      expect(mappedTicks[1]).to.deep.equal({ range: 200, domain: 1 });
      expect(mappedTicks[2]).to.deep.equal({ range: 400, domain: 2 });
    });
  });
});
