export default function bucketize({ items, from, bucketSize, getTimestampForItem = item => item }) {
  if (items.length === 0) {
    return createEmptyBucketResult();
  }

  const bucketResult = {
    maxItemsPerBucket: 0
  };
  const bucketMap = new Map();
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const timestamp = getTimestampForItem(item);
    const bucketIndex = Math.floor((timestamp - from) / bucketSize);
    if (!bucketMap.has(bucketIndex)) {
      bucketMap.set(bucketIndex, { from: Math.floor(from + bucketIndex * bucketSize), bucketSize, items: [] });
    }
    const bucket = bucketMap.get(bucketIndex);
    bucket.items.push(item);
    bucketResult.maxItemsPerBucket = Math.max(bucketResult.maxItemsPerBucket, bucket.items.length);
  }

  bucketResult.buckets = Array.from(bucketMap.values());

  return bucketResult;
}

function createEmptyBucketResult() {
  return {
    maxItemsPerBucket: 0,
    buckets: []
  };
}
