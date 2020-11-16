import {
  INFRA_EXPLORE_FILTERS_CLEARED,
  INFRA_EXPLORE_FILTER_ADDED,
  INFRA_EXPLORE_FILTER_REMOVED,
  INFRA_EXPLORE_GROUP_ADDED,
  INFRA_EXPLORE_GROUP_COLLAPSED,
  INFRA_EXPLORE_GROUP_EXPANDED,
  INFRA_EXPLORE_GROUP_FOCUSED_ON,
  INFRA_EXPLORE_GROUP_REMOVED,
  INFRA_EXPLORE_LOAD_MORE,
  INFRA_EXPLORE_NAVIGATE_TO_ENTITY_DASHBOARD,
  INFRA_EXPLORE_TYPE_SELECTOR_STATE_CHANGED,
  INFRA_EXPLORE_METRIC_ADDED,
  INFRA_EXPLORE_METRIC_REMOVED,
  INFRA_EXPLORE_METRIC_AGGREGATION_CHANGED,
  INFRA_EXPLORE_SORTED,
  track
} from 'in-services/tracking/tracking';

export function filterAddedTracker(getInfraExploreState) {
  return function(addedFilter) {
    const context = serializeContext(getInfraExploreState(), { addedFilter });
    track(INFRA_EXPLORE_FILTER_ADDED, context);
  };
}

export function filterRemovedTracker(getInfraExploreState) {
  return function(removedFilter) {
    const context = serializeContext(getInfraExploreState(), { removedFilter });
    track(INFRA_EXPLORE_FILTER_REMOVED, context);
  };
}

export function filtersClearedTracker(getInfraExploreState) {
  return function() {
    track(INFRA_EXPLORE_FILTERS_CLEARED, serializeContext(getInfraExploreState()));
  };
}

export function groupAddedTracker(getInfraExploreState) {
  return function(addedGroup) {
    const context = serializeContext(getInfraExploreState(), { addedGroup: addedGroup.groupbyTag });
    track(INFRA_EXPLORE_GROUP_ADDED, context);
  };
}

export function groupRemovedTracker(getInfraExploreState) {
  return function(removedGroup) {
    const context = serializeContext(getInfraExploreState(), { removedGroup: removedGroup.groupbyTag });
    track(INFRA_EXPLORE_GROUP_REMOVED, context);
  };
}

export function groupFocusedOnTracker(getInfraExploreState) {
  return function({ tags }) {
    const context = serializeContext(getInfraExploreState(), { focusedGroup: tags });
    track(INFRA_EXPLORE_GROUP_FOCUSED_ON, context);
  };
}

export function groupExpandedTracker(getInfraExploreState) {
  return function({ tags }) {
    const context = serializeContext(getInfraExploreState(), { expandedGroup: tags });
    track(INFRA_EXPLORE_GROUP_EXPANDED, context);
  };
}

export function groupCollapsedTracker(getInfraExploreState) {
  return function({ tags }) {
    const context = serializeContext(getInfraExploreState(), { collapsedGroup: tags });
    track(INFRA_EXPLORE_GROUP_COLLAPSED, context);
  };
}

export function navigateToEntityTracker(getInfraExploreState) {
  return function(pluginId) {
    const context = serializeContext(getInfraExploreState(), { plugin: pluginId });
    track(INFRA_EXPLORE_NAVIGATE_TO_ENTITY_DASHBOARD, context);
  };
}

export function typeSelectorChangedTracker(getInfraExploreState) {
  return function(selectedType) {
    const context = serializeContext(getInfraExploreState(), { selectedType });
    track(INFRA_EXPLORE_TYPE_SELECTOR_STATE_CHANGED, context);
  };
}

export const LOAD_MORE_CONTEXT = {
  GROUPS: 'GROUPS',
  ENTITIES_IN_GROUP: 'ENTITIES_IN_GROUP',
  UNGROUPED_ENTITIES: 'UNGROUPED_ENTITIES'
};
export function loadMoreTracker(getInfraExploreState) {
  return function(pagesLoaded, loadMoreContext) {
    const context = serializeContext(getInfraExploreState(), { pagesLoaded, loadMoreContext });
    track(INFRA_EXPLORE_LOAD_MORE, context);
  };
}

export function metricAddedTracker(getInfraExploreState) {
  return function({ metric: addedMetric, aggregation: addedAggregation }) {
    const context = serializeContext(getInfraExploreState(), { addedMetric, addedAggregation });
    track(INFRA_EXPLORE_METRIC_ADDED, context);
  };
}

export function metricRemovedTracker(getInfraExploreState) {
  return function({ metric: removedMetric, aggregation: removedAggregation }) {
    const context = serializeContext(getInfraExploreState(), { removedMetric, removedAggregation });
    track(INFRA_EXPLORE_METRIC_REMOVED, context);
  };
}

export function metricAggregationChangedTracker(getInfraExploreState) {
  return function({ metric: changedMetric, aggregation: oldAggregation }, newAggregation) {
    const context = serializeContext(getInfraExploreState(), { changedMetric, oldAggregation, newAggregation });
    track(INFRA_EXPLORE_METRIC_AGGREGATION_CHANGED, context);
  };
}

export const SORTING_CONTEXT = {
  ENTITIES: 'ENTITIES',
  GROUPS: 'GROUPS'
};
export function sortingTracker(getInfraExploreState) {
  return function({ by, direction }, sortingContext) {
    const context = serializeContext(getInfraExploreState(), {
      sortedBy: by,
      sortDirection: direction,
      sortingContext
    });
    track(INFRA_EXPLORE_SORTED, context);
  };
}

/**
 * Converts infra explore state and other event data into a MixPanel-compartible format. MixPanel doesn't allow objects for event prop values. See https://help.mixpanel.com/hc/en-us/articles/115004547063-Properties-Supported-Data-Types
 * Fields in event props prefixed with _ denote infra explore state before the event. Non-underscore-prefixed props are attributes of the event itself.
 * @param {object} infraExploreStateBeforeEvent State of infra explore params BEFORE the event happened. This object matches the urlState params of the #/explore page
 * @param {object} extraEventProps Any other properties / data that are specific to th event being tracked.
 */
function serializeContext(infraExploreStateBeforeEvent, extraEventProps = {}) {
  const { type, tagFilterExpression = [], group = {}, metrics = [], order = {} } = infraExploreStateBeforeEvent;
  return {
    _type: type,
    _filters: tagFilterExpression.map(element => JSON.stringify(element)),
    _filterCount: tagFilterExpression.length,
    _group: group.groupbyTag,
    _metrics: metrics.map(metricObject => metricObject.metric),
    _orderBy: order.by,
    _orderDirection: order.direction,
    ...serializeExtraProps(extraEventProps)
  };
}

function serializeExtraProps(extraEventProps) {
  const propsWithStringifiedObjectValues = Object.entries(extraEventProps).map(([key, value]) =>
    typeof value === 'object' ? { [key]: JSON.stringify(value) } : { [key]: value }
  );
  return Object.assign({}, ...propsWithStringifiedObjectValues);
}
