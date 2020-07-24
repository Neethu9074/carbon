import { getNumberTagFilters } from 'in-analyze/components/filterBar/NumberBarItemBehavior/util';

export function latencySelection(filters) {
  // find the most significant latency filters for each operator type, e.g.
  // call.latency > 2 is more significant than call.latency > 1
  const latencyFilters = getNumberTagFilters({
    tagFilters: filters.tagFilter,
    tag: 'call.latency',
    showRange: true
  });

  // values can come as numbers or/and strings
  let from = null;
  let to = null;
  if (latencyFilters.lt) {
    to = parseInt(latencyFilters.lt.value);
  } else if (latencyFilters.lte) {
    to = parseInt(latencyFilters.lte.value) + 1;
  }
  if (latencyFilters.gt) {
    from = Math.max(0, parseInt(latencyFilters.gt.value) + 1);
  } else if (latencyFilters.gte) {
    from = parseInt(latencyFilters.gte.value);
  }

  const selection = {};
  if (from) {
    selection.from = from;
  }
  if (to) {
    selection.to = to;
  }
  return selection;
}
