/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export default function bucketize({ sortedTimestamps, bucketSizeInMillis }) {
  if (sortedTimestamps.length === 0) {
    return [];
  }

  let index = 0;
  let currentBucket = [];
  const buckets = [currentBucket];
  let firstTimestampInCurrentBucket = null;
  while (index < sortedTimestamps.length) {
    const timestamp = sortedTimestamps[index++];
    if (firstTimestampInCurrentBucket && timestamp - firstTimestampInCurrentBucket > bucketSizeInMillis) {
      firstTimestampInCurrentBucket = timestamp;
      currentBucket = [];
      buckets.push(currentBucket);
    }
    currentBucket.push(timestamp);

    if (!firstTimestampInCurrentBucket) {
      firstTimestampInCurrentBucket = timestamp;
    }
  }

  return buckets;
}
