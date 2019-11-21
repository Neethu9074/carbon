/* eslint-env mocha, node */
import { expect } from 'chai';

import { countSamples } from 'in-profiling/analyze/AnalyzeView/ProfilesView/Profile';

describe('in-profiling/analyze/AnalyzeView/ProfilesView/Profile', () => {
  describe('#countSamples', () => {
    it('should sum up all samples inside the profile', () => {
      expect(countSamples({})).to.equal(0);

      expect(
        countSamples({
          numSamples: 2,
          children: [
            { numSamples: 5, children: [{ numSamples: 0, children: [] }] },
            {
              numSamples: 1,
              children: [{ numSamples: 13, children: [{ numSamples: 6, children: [{ numSamples: 2, children: [] }] }] }]
            },
            {
              numSamples: 2,
              children: [
                { numSamples: 5, children: [{ numSamples: 0, children: [] }] },
                {
                  numSamples: 6,
                  children: []
                }
              ]
            }
          ]
        })
      ).to.equal(42);
    });
  });
});
