/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  getRangeFromBackendQueryModel,
  getRangeFromFilters,
  updateRange
} from 'in-components/QueryBuilder/transformation/backendQueryModel';
import {
  GREATER_OR_EQUAL_THAN,
  LESS_OR_EQUAL_THAN,
  LESS_THAN,
  GREATER_THAN
} from 'in-components/QueryBuilder/tagFilter/operators';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { dataSourceConstants } from 'in-applications/analyze/metrics';

export function getLatencySelectionFromTagFilterExpression(dataSource, tagFilterExpression) {
  return getRangeFromBackendQueryModel(dataSourceConstants[dataSource].latencyTag, tagFilterExpression);
}

export function getLatencySelectionFromFilters(dataSource, tagFilter) {
  return getRangeFromFilters(dataSourceConstants[dataSource].latencyTag, tagFilter);
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

export function updateLatencySelection({ dataSource, selection, tagFilterExpression, updateFilter }) {
  updateRange({
    tag: dataSourceConstants[dataSource].latencyTag,
    selection,
    backendQueryModel: tagFilterExpression,
    updateFilter
  });
}
