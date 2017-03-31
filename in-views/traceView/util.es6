import { getCategory, SPAN_KINDS } from 'in-sdk/tracing';

export function getSelfTime(span) {
  let selfTime = span.get('duration');
  span.get('childSpans').forEach(childSpan => {
    if (!childSpan.get('async')) {
      selfTime -= childSpan.get('duration');
    }
  });
  return Math.max(selfTime, 0);
}

export function getDepth(span, currentDepth) {
  const kind = span.get('kind');
  if (currentDepth != null && (kind === SPAN_KINDS.EXIT || kind === SPAN_KINDS.INTERMEDIATE)) {
    currentDepth++;
  }

  if (currentDepth == null) {
    currentDepth = 1;
  }

  let maxDepth = currentDepth;
  span.get('childSpans').forEach(childSpan => {
    maxDepth = Math.max(maxDepth, getDepth(childSpan, currentDepth));
  });

  return maxDepth;
}

export function getErrorCount(span) {
  let count = 0;
  count += span.get('errorCount', span.get('error') ? 1 : 0);

  span.get('childSpans').forEach(childSpan => {
    count += getErrorCount(childSpan);
  });

  return count;
}

export function getCalls(span, count) {
  const kind = span.get('kind');
  if (kind === SPAN_KINDS.EXIT || kind === SPAN_KINDS.INTERMEDIATE) {
    if (count == null) {
      count = 0;
    }

    const batchSize = span.get('batchSize');
    count += batchSize === 0 ? 1 : batchSize;
  }

  if (count == null) {
    const batchSize = span.get('batchSize');
    count = batchSize === 0 ? 1 : batchSize;
  }

  span.get('childSpans').forEach(childSpan => {
    count = getCalls(childSpan, count);
  });

  return count;
}

export function getPerCategorySummary(span, collector) {
  collector = collector || {};

  const category = getCategory(span);
  const categorySummary = (collector[category] = collector[category] || {
    category,
    calls: 0,
    durationTotal: 0,
    durationSelf: 0
  });
  categorySummary.calls += Math.max(1, span.get('batchSize', 1));
  categorySummary.durationTotal += span.get('duration');
  categorySummary.durationSelf += getSelfTime(span);

  span.get('childSpans').forEach(childSpan => getPerCategorySummary(childSpan, collector));

  return collector;
}

export function getStart(span) {
  let earliestStart = span.get('start');

  span.get('childSpans').forEach(childSpan => {
    earliestStart = Math.min(earliestStart, getStart(childSpan));
  });

  return earliestStart;
}

export function getEnd(span) {
  let latestEnd = span.get('start') + span.get('duration');

  span.get('childSpans').forEach(childSpan => {
    latestEnd = Math.max(latestEnd, getEnd(childSpan));
  });

  return latestEnd;
}
