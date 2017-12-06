/* eslint-env mocha */
import { expect } from 'chai';

import { find } from './arrayUtils';

describe('arrayUtils', () => {
  describe('find', () => {
    it('should find primitive number', () => {
      expect(find([0, 1, 2, 3, 123, 321, 2, 231], item => item === 123)).to.be.equal(123);
    });

    it('should find primitive string', () => {
      expect(find(['a', 'ab', 'abc', 'v', 'c'], item => item === 'ab')).to.be.equal('ab');
    });

    it('should find objects', () => {
      expect(
        find(
          [{ id: -1, value: 0 }, { id: -1, value: 1 }, { id: 123, value: 3 }, { id: 0, value: 2 }],
          item => item.id === -1
        ).value
      ).to.be.equal(0);
    });

    it('should return undefined if nothing is found', () => {
      expect(
        find(
          [{ id: -1, value: 0 }, { id: -1, value: 1 }, { id: 123, value: 3 }, { id: 0, value: 2 }],
          item => item.id === 'dontFindThis'
        )
      ).to.be.equal(undefined);
    });
  });
});
