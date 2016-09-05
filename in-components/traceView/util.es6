import {getCategory, getDirection} from 'in-sdk/tracing';

export function getSelfTime(span) {
  let selfTime = span.get('duration');
  span.get('childSpans').forEach(childSpan => {
    if (!childSpan.get('async')) {
      selfTime -= childSpan.get('duration');
    }
  });
  return Math.max(selfTime, 0);
}


export function getDepth(span, currentDepth = 1) {
  const direction = getDirection(span);
  if (direction === 'exit' || direction === 'entryAndExit') {
    currentDepth++;
  }

  let maxDepth = currentDepth;
  span.get('childSpans').forEach(childSpan => {
    maxDepth = Math.max(maxDepth, getDepth(childSpan, currentDepth));
  });

  return maxDepth;
}


export function getErrorCount(span) {
  let count = 0;
  if (span.get('error')) {
    count++;
  }

  span.get('childSpans').forEach(childSpan => {
    count += getErrorCount(childSpan);
  });

  return count;
}

export function getCalls(span, count = 1) {
  const direction = getDirection(span);
  if (direction === 'exit' || direction === 'entryAndExit') {
    count++;
  }

  span.get('childSpans').forEach(childSpan => {
    count = getCalls(childSpan, count);
  });

  return count;
}

export function getPerCategorySummary(span, collector) {
  collector = collector || {};

  const category = getCategory(span);
  const categorySummary = collector[category] = collector[category] || {
    category,
    calls: 0,
    durationTotal: 0,
    durationSelf: 0
  };
  categorySummary.calls++;
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
