/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */
import { expect } from 'chai';

import { diff, find, intersperse } from './arrayUtils';

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
          [
            { id: -1, value: 0 },
            { id: -1, value: 1 },
            { id: 123, value: 3 },
            { id: 0, value: 2 }
          ],
          item => item.id === -1
        ).value
      ).to.be.equal(0);
    });

    it('should return undefined if nothing is found', () => {
      expect(
        find(
          [
            { id: -1, value: 0 },
            { id: -1, value: 1 },
            { id: 123, value: 3 },
            { id: 0, value: 2 }
          ],
          item => item.id === 'dontFindThis'
        )
      ).to.be.equal(undefined);
    });
  });

  describe('diff', () => {
    it('should identify new nodes', () => {
      expect(diff([], []).uniqueItemsB).to.have.members([]);
      expect(diff([1, 2, 3, 4], [5, 6]).uniqueItemsB).to.have.members([5, 6]);
      expect(diff([1, 2, 3, 4], [1, 2, 3, 7]).uniqueItemsB).to.have.members([7]);
      expect(diff([], [42]).uniqueItemsB).to.have.members([42]);
      expect(diff([42, 4711], []).uniqueItemsB).to.have.members([]);
    });

    it('should identify present nodes', () => {
      expect(diff([1, 2, 3], []).sharedItems).to.have.members([]);
      expect(diff([], [1, 2, 3]).sharedItems).to.have.members([]);
      expect(diff([2], [1, 2, 3]).sharedItems).to.have.members([2]);
      expect(diff([1, 2, 3], [1, 2, 3]).sharedItems).to.have.members([1, 2, 3]);
      expect(diff([1, 2, 3], [2, 6, 3]).sharedItems).to.have.members([2, 3]);
    });

    it('should identify removed nodes', () => {
      expect(diff([42, 4711], []).uniqueItemsA).to.have.members([42, 4711]);
      expect(diff([42, 4711], [2]).uniqueItemsA).to.have.members([42, 4711]);
      expect(diff([42, 4711], [42]).uniqueItemsA).to.have.members([4711]);
      expect(diff([1, 2], [3, 4]).uniqueItemsA).to.have.members([1, 2]);
      expect(diff([1, 2], [1, 2]).uniqueItemsA).to.have.members([]);
    });
  });

  describe('intersperse', () => {
    it('should not change an empty array', () => {
      expect(intersperse([], 'will not be inserted')).to.deep.equal([]);
    });

    it('should not change an array of length one', () => {
      expect(intersperse(['ohai'], 'will not be inserted')).to.deep.equal(['ohai']);
    });

    it('should intersperse between two elements', () => {
      expect(intersperse(['ohai', 'kthxbye'], 'will be inserted')).to.deep.equal([
        'ohai',
        'will be inserted',
        'kthxbye'
      ]);
    });

    it('should intersperse between many elements', () => {
      expect(intersperse([1, 2, 3, 4, 5, 6, 7], 0)).to.deep.equal([1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7]);
    });

    it('should handle null interspersee', () => {
      expect(intersperse([1, 2, 3, 4, 5, 6, 7], null)).to.deep.equal([
        1,
        null,
        2,
        null,
        3,
        null,
        4,
        null,
        5,
        null,
        6,
        null,
        7
      ]);
    });

    it('should intersperse with a function', () => {
      expect(intersperse(['a', 'b', 'c', 'd'], i => '' + i)).to.deep.equal(['a', '1', 'b', '2', 'c', '3', 'd']);
    });
  });
});
