/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */

import { expect } from 'chai';

import bucketize from 'in-services/util/bucketize';

describe('in-services/util/bucketize', () => {
  it('should return one cluster if there are no items', () => {
    const buckets = bucketize({ sortedTimestamps: [] });
    expect(buckets).to.has.length(0);
  });

  it('should cluster items', () => {
    const buckets = bucketize({
      sortedTimestamps: [0, 20, 40, 100, 400, 620, 700, 900, 901],
      bucketSizeInMillis: 100
    });

    expect(buckets).to.has.length(4);

    expect(buckets[0]).to.deep.equal([0, 20, 40, 100]);
    expect(buckets[1]).to.deep.equal([400]);
    expect(buckets[2]).to.deep.equal([620, 700]);
    expect(buckets[3]).to.deep.equal([900, 901]);
  });
});
