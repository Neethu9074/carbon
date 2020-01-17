export function isInsideHighlightedTimeframe(timestamp, highlightedTimeframe) {
  if (!highlightedTimeframe) {
    return false;
  }

  const from = highlightedTimeframe[0];
  const to = highlightedTimeframe[1];
  return timestamp >= from && timestamp <= to;
}
