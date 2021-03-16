/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha, node */
import { expect } from 'chai';

import { categorise, filter, score } from 'in-waiting-for-deployment/components/OnboardingWidget/contentUtils';

describe('in-waiting-for-deployment/components/OnboardingWidget/contentUtils', () => {
  describe('#categorise', () => {
    it('should return an empty array on a given empty array', () => {
      expect(categorise([])).to.have.length(0);
    });

    it('should create categories', () => {
      const result = categorise([
        { id: 1, category: 'c' },
        { id: 2, category: 'a' },
        { id: 3, category: 'b' },
        { id: 4, category: 'a' },
        { id: 5, category: 'b' }
      ]);
      expect(result).to.have.length(3);

      const ca = result.find(c => c.title === 'a');
      const cb = result.find(c => c.title === 'b');
      const cc = result.find(c => c.title === 'c');
      expect(ca.items).to.have.length(2);
      expect(cb.items).to.have.length(2);
      expect(cc.items).to.have.length(1);

      expect(ca.items).to.deep.include.members([
        { category: 'a', id: 2 },
        { category: 'a', id: 4 }
      ]);
      expect(cb.items).to.deep.include.members([
        { category: 'b', id: 3 },
        { category: 'b', id: 5 }
      ]);
      expect(cc.items).to.deep.include.members([{ category: 'c', id: 1 }]);
    });
  });

  describe('#score', () => {
    it('should apply scores based on the search query', () => {
      const entities = [
        { keyWords: 'a' },
        { keyWords: 'b' },
        { keyWords: 'c' },
        { keyWords: 'a b' },
        { keyWords: 'b c' },
        { keyWords: 'a b c' }
      ];

      score(entities, 'a');
      expect(entities).to.deep.include.members([
        { keyWords: 'a', __score: 1 },
        { keyWords: 'b', __score: 0 },
        { keyWords: 'c', __score: 0 },
        { keyWords: 'a b', __score: 1 },
        { keyWords: 'b c', __score: 0 },
        { keyWords: 'a b c', __score: 1 }
      ]);

      score(entities, 'a b');
      expect(entities).to.deep.include.members([
        { keyWords: 'a', __score: 0.5 },
        { keyWords: 'b', __score: 0.5 },
        { keyWords: 'c', __score: 0 },
        { keyWords: 'a b', __score: 1 },
        { keyWords: 'b c', __score: 0.5 },
        { keyWords: 'a b c', __score: 1 }
      ]);
    });

    it('should apply scores to subcatogories', () => {
      const entities = [
        {
          subTechnologies: [{ keyWords: 'b' }, { keyWords: 'c' }]
        },
        { keyWords: 'b' },
        { keyWords: 'c' },
        { keyWords: 'a b' },
        { keyWords: 'b c' },
        { subTechnologies: [{ keyWords: 'b' }, { keyWords: 'a' }] }
      ];

      score(entities, 'a');
      expect(entities).to.deep.include.members([
        {
          __score: 0,
          subTechnologies: [
            { keyWords: 'b', __score: 0 },
            { keyWords: 'c', __score: 0 }
          ]
        },
        { keyWords: 'b', __score: 0 },
        { keyWords: 'c', __score: 0 },
        { keyWords: 'a b', __score: 1 },
        { keyWords: 'b c', __score: 0 },
        {
          __score: 1,
          subTechnologies: [
            { keyWords: 'b', __score: 0 },
            { keyWords: 'a', __score: 1 }
          ]
        }
      ]);
    });
  });

  describe('#filter', () => {
    it('should filter entities based on the score', () => {
      const entities = [{ __score: 0 }, { __score: 0.1 }, { __score: 1 }, { __score: -1 }];

      expect(filter(entities)).to.deep.include.members([{ __score: 0.1 }, { __score: 1 }]);
    });
  });
});
