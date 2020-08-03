import {
  GREATER_OR_EQUAL_THAN,
  LESS_OR_EQUAL_THAN,
  LESS_THAN,
  GREATER_THAN
} from 'in-new-components/QueryBuilder/tagFilter/operators';
import { getNumberTagFilters } from 'in-analyze/components/filterBar/NumberBarItemBehavior/util';
import { NOT_APPLICABLE } from 'in-new-components/QueryBuilder/tagFilter/entities';

export function getLatencySelectionFromFilters(dataSource, tagFilter) {
  // find the most significant latency filters for each operator type, e.g.
  // call.latency > 2 is more significant than call.latency > 1
  const latencyFilters = getNumberTagFilters({
    tagFilters: tagFilter,
    tag: dataSource === 'traces' ? 'trace.latency' : 'call.latency',
    showRange: true,
    showEquality: true
  });

  if (latencyFilters.neq) {
    // don't support selection when filter with "!=" is used
    return {};
  }

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

  if (latencyFilters.eq) {
    if (!from && !to) {
      selection.from = parseInt(latencyFilters.eq.value);
      // the upper bound is specified as strict inequality (<), need to increment it by 1
      selection.to = selection.from + 1;
    }
  } else if (from == null || to == null || from < to) {
    if (from) {
      selection.from = from;
    }
    if (to) {
      selection.to = to;
    }
  }
  return selection;
}

// Keep the original position of the latency filters in the filter list.
export function updateLatencyFilters(dataSource, tagFilter, selection) {
  const latencyTagName = dataSource === 'traces' ? 'trace.latency' : 'call.latency';

  const fromFilterIdxOld = tagFilter.findIndex(
    f => f.name === latencyTagName && (f.operator === GREATER_THAN || f.operator === GREATER_OR_EQUAL_THAN)
  );
  const toFilterIdxOld = tagFilter.findIndex(
    f => f.name === latencyTagName && (f.operator === LESS_THAN || f.operator === LESS_OR_EQUAL_THAN)
  );

  const fromLatencyFilter = selection.from && {
    name: latencyTagName,
    value: selection.from,
    operator: GREATER_OR_EQUAL_THAN,
    entity: NOT_APPLICABLE
  };
  const toLatencyFilter = selection.to && {
    name: latencyTagName,
    value: selection.to,
    operator: LESS_THAN,
    entity: NOT_APPLICABLE
  };

  // use old position, otherwise use other bound position
  const fromFilterIdxNew = fromFilterIdxOld === -1 ? toFilterIdxOld : fromFilterIdxOld;
  const toFilterIdxNew = toFilterIdxOld === -1 ? fromFilterIdxOld : toFilterIdxOld;

  let updatedTagFilter = [...tagFilter];

  if (fromFilterIdxOld === -1 && toFilterIdxOld === -1) {
    // add at the end
    updatedTagFilter = [...updatedTagFilter, fromLatencyFilter, toLatencyFilter];
  } else if (fromFilterIdxOld === -1) {
    // no previous from filter but a to filter, put from before to
    updatedTagFilter.splice(toFilterIdxNew, 1, fromLatencyFilter, toLatencyFilter);
  } else if (toFilterIdxOld === -1) {
    // no previous to filter but a from filter, put from before to
    updatedTagFilter.splice(fromFilterIdxNew, 1, fromLatencyFilter, toLatencyFilter);
  } else {
    // edit in place
    updatedTagFilter.splice(fromFilterIdxNew, 1, fromLatencyFilter);
    updatedTagFilter.splice(toFilterIdxNew, 1, toLatencyFilter);
  }
  // keep only the selection based latency filters
  updatedTagFilter = updatedTagFilter.filter(
    f => f && (f.name !== latencyTagName || f == fromLatencyFilter || f == toLatencyFilter)
  );

  return updatedTagFilter;
}
