/// <reference path="../../typings/all.d.ts" />

import {expect} from 'chai';
import {getSortedIndex} from './binarySearch';

describe('tsdb.binarySearch', () => {

  let arr: number[];

  describe('empty array', () => {
    it('should support empty arrays', () => {
      expect(getSortedIndex([], 5)).to.equal(0);
    });
  });

  describe('value in array', () => {
    it('first in array', () => {
      arr = [1, 2, 3, 4];
      expect(getSortedIndex(arr, 1)).to.equal(0);
    });

    it('last in array', () => {
      arr = [1, 2, 3, 4];
      expect(getSortedIndex(arr, 4)).to.equal(3);
    });

    it('middle of an uneven length array', () => {
      arr = [1, 2, 3];
      expect(getSortedIndex(arr, 2)).to.equal(1);
    });

    it('middle of an even length array', () => {
      arr = [1, 2, 3, 4];
      expect(getSortedIndex(arr, 2)).to.equal(1);
      expect(getSortedIndex(arr, 3)).to.equal(2);
    });
  });

  describe('value not in array', () => {
    it('would be the first', () => {
      arr = [1, 2, 3];
      expect(getSortedIndex(arr, 0)).to.equal(0);
    });

    it('would be the last', () => {
      arr = [1, 2, 3];
      expect(getSortedIndex(arr, 4)).to.equal(3);
    });

    it('would be in the middle of an even length array', () => {
      arr = [1, 2, 4, 5];
      expect(getSortedIndex(arr, 3)).to.equal(2);
    });

    it('would be arround the middle on an uneven length array', () => {
      arr = [1, 3, 5];
      expect(getSortedIndex(arr, 2)).to.equal(1);
      expect(getSortedIndex(arr, 4)).to.equal(2);
    });
  });
});
