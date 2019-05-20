export default function fillMissingBuckets(buckets, from, to) {
  if (buckets.length === 0) {
    return buckets;
  }

  // all buckets have the same size, so just take the first one to calculate it
  const bucketSize = buckets[0].to - buckets[0].from;

  return getBucketsBefore(buckets, bucketSize, from)
    .concat(buckets)
    .concat(getBucketsAfter(buckets, bucketSize, to));
}

export function getBucketsBefore(buckets, bucketSize, startTimestamp) {
  const oldestBucketStart = buckets[0].from;
  const bucketsBefore = [];

  for (let i = oldestBucketStart; i > startTimestamp; i -= bucketSize) {
    bucketsBefore.unshift({
      from: i - bucketSize,
      to: i,
      latencyBuckets: []
    });
  }

  return bucketsBefore;
}

export function getBucketsAfter(buckets, bucketSize, endTimestamp) {
  const youngestBucketEnd = buckets[buckets.length - 1].to;
  const bucketsAfter = [];

  for (let i = youngestBucketEnd; i < endTimestamp; i += bucketSize) {
    bucketsAfter.push({
      from: i,
      to: i + bucketSize,
      latencyBuckets: []
    });
  }

  return bucketsAfter;
}
