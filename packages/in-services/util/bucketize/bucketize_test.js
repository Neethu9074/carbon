/* eslint-env mocha */

import { expect } from 'chai';

import bucketize from 'in-services/util/bucketize';

describe('in-services/util/bucketize', () => {
  it('should return one cluster if there are no items', () => {
    const bucketResult = bucketize({ items: [] });
    expect(bucketResult.buckets).to.has.length(0);
    expect(bucketResult.maxItemsPerBucket).to.equal(0);
  });

  it('should cluster items', () => {
    const bucketResult = bucketize({
      items: [0, 20, 40, 100, 400, 620, 700, 900, 901],
      from: 0,
      bucketSize: 100
    });

    expect(bucketResult.buckets).to.has.length(6);
    expect(bucketResult.maxItemsPerBucket).to.equal(3);

    expect(bucketResult.buckets[0].items).to.deep.equal([0, 20, 40]);
    expect(bucketResult.buckets[0].from).to.equal(0);

    expect(bucketResult.buckets[1].items).to.deep.equal([100]);
    expect(bucketResult.buckets[1].from).to.equal(100);

    expect(bucketResult.buckets[2].items).to.deep.equal([400]);
    expect(bucketResult.buckets[2].from).to.equal(400);

    expect(bucketResult.buckets[3].items).to.deep.equal([620]);
    expect(bucketResult.buckets[3].from).to.equal(600);

    expect(bucketResult.buckets[4].items).to.deep.equal([700]);
    expect(bucketResult.buckets[4].from).to.equal(700);

    expect(bucketResult.buckets[5].items).to.deep.equal([900, 901]);
    expect(bucketResult.buckets[5].from).to.equal(900);
  });
});
