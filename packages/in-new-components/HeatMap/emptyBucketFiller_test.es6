/* eslint-env mocha */
import { expect } from 'chai';

import fillMissingBuckets, { getBucketsBefore, getBucketsAfter } from 'in-new-components/HeatMap/emptyBucketFiller';

describe('in-new-components/HeatMap/emptyBucketFiller', () => {
  describe('getBucketsBefore', () => {
    it('should get empty array', () => {
      const buckets = getBucketsBefore([{ from: 6000 }], 1000, 6000);
      expect(buckets).to.deep.equal([]);
    });

    it('should get buckets', () => {
      const buckets = getBucketsBefore([{ from: 6000 }], 1000, 2000);
      expect(buckets).to.have.length([4]);

      expect(buckets[0].from).to.equal(2000);
      expect(buckets[0].to).to.equal(3000);

      expect(buckets[1].from).to.equal(3000);
      expect(buckets[1].to).to.equal(4000);

      expect(buckets[2].from).to.equal(4000);
      expect(buckets[2].to).to.equal(5000);

      expect(buckets[3].from).to.equal(5000);
      expect(buckets[3].to).to.equal(6000);
    });
  });

  describe('getBucketsAfter', () => {
    it('should get empty array', () => {
      const buckets = getBucketsAfter([{ to: 6000 }], 1000, 6000);
      expect(buckets).to.deep.equal([]);
    });

    it('should get buckets', () => {
      const buckets = getBucketsAfter([{ to: 6000 }], 1000, 10000);
      expect(buckets).to.have.length([4]);

      expect(buckets[0].from).to.equal(6000);
      expect(buckets[0].to).to.equal(7000);

      expect(buckets[1].from).to.equal(7000);
      expect(buckets[1].to).to.equal(8000);

      expect(buckets[2].from).to.equal(8000);
      expect(buckets[2].to).to.equal(9000);

      expect(buckets[3].from).to.equal(9000);
      expect(buckets[3].to).to.equal(10000);
    });
  });

  describe('fillMissingBuckets', () => {
    it('should add nothing on empty result', () => {
      expect(fillMissingBuckets([], null, null)).to.deep.equal([]);
    });

    it('should fill empty buckets', () => {
      const filledBuckets = fillMissingBuckets(
        [{ from: 4, to: 6 }, { from: 6, to: 8 }, { from: 8, to: 10 }, { from: 10, to: 12 }],
        0,
        20
      );
      expect(filledBuckets).to.have.length([10]);

      expect(filledBuckets[0].from).to.equal(0);
      expect(filledBuckets[0].to).to.equal(2);

      expect(filledBuckets[1].from).to.equal(2);
      expect(filledBuckets[1].to).to.equal(4);

      expect(filledBuckets[2].from).to.equal(4);
      expect(filledBuckets[2].to).to.equal(6);

      expect(filledBuckets[3].from).to.equal(6);
      expect(filledBuckets[3].to).to.equal(8);

      expect(filledBuckets[4].from).to.equal(8);
      expect(filledBuckets[4].to).to.equal(10);

      expect(filledBuckets[5].from).to.equal(10);
      expect(filledBuckets[5].to).to.equal(12);

      expect(filledBuckets[6].from).to.equal(12);
      expect(filledBuckets[6].to).to.equal(14);

      expect(filledBuckets[7].from).to.equal(14);
      expect(filledBuckets[7].to).to.equal(16);

      expect(filledBuckets[8].from).to.equal(16);
      expect(filledBuckets[8].to).to.equal(18);

      expect(filledBuckets[9].from).to.equal(18);
      expect(filledBuckets[9].to).to.equal(20);
    });
  });
});
