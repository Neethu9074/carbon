/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useCallback, useMemo } from 'react';

import {
  filterAddedTracker,
  filterRemovedTracker,
  filtersClearedTracker,
  groupAddedTracker,
  groupRemovedTracker,
  groupFocusedOnTracker,
  navigateToEntityTracker,
  typeSelectorChangedTracker,
  groupExpandedTracker,
  groupCollapsedTracker,
  loadMoreTracker,
  metricAddedTracker,
  metricRemovedTracker,
  metricAggregationChangedTracker,
  sortingTracker,
  LOAD_MORE_CONTEXT,
  SORTING_CONTEXT
} from 'in-infrastructure/Explore/services/tracking';
import {
  tagFilterExpressionMatrixParameter,
  resetMetricsAndOrderOnTypeChange,
  metricsMatrixParameter,
  chartsMatrixParameter,
  groupMatrixParameter,
  orderMatrixParameter,
  typeMatrixParameter
} from 'in-infrastructure/navigation/paths';
import GroupingConfigurator, {
  isGroupingConfigurationValid
} from 'in-infrastructure/Explore/components/GroupingConfigurator';
import GroupingConfiguratorSection from 'in-new-components/GroupingConfigurator/GroupingConfiguratorSection';
import FixatedTimeConfigContextModification from 'in-stores/time/FixatedTimeConfigContextModification';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import ApiQueryAction from 'in-new-components/QueryBuilder/workspace/ApiQueryAction/ApiQueryAction';
import QueryBuilder, { isQueryValid } from 'in-infrastructure/Explore/components/QueryBuilder';
import QueryBuilderSection from 'in-new-components/QueryBuilder/workspace/QueryBuilderSection';
import GroupedInfrastructure from 'in-infrastructure/Explore/components/GroupedInfrastructure';
import InfraPageHeaderWithTabs from 'in-infrastructure/components/InfraPageHeaderWithTabs';
import InfrastructureList from 'in-infrastructure/Explore/components/InfrastructureList';
import { getMetrics, fromUrlMetrics } from 'in-infrastructure/Explore/services/metrics';
import { ActionSection } from 'in-new-components/workspace/ActionSection/ActionSection';
import { themes } from 'in-new-components/DashboardHeader/DashboardHeader';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { warning, error } from 'in-new-components/Message/types';
import Sections from 'in-new-components/workspace/Sections';
import { pendingResult } from 'in-services/fixedObjects';
import Stack from 'in-new-components/layout/Stack';
import useObservable from 'in-hooks/useObservable';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Message from 'in-new-components/Message';
import useUrlState from 'in-hooks/useUrlState';
import Title from 'in-components/Title';

import locals from './Explore.mless';

const urlStateDefinition = {
  bind: [
    tagFilterExpressionMatrixParameter,
    groupMatrixParameter,
    chartsMatrixParameter,
    metricsMatrixParameter,
    orderMatrixParameter,
    typeMatrixParameter
  ],
  resets: [resetMetricsAndOrderOnTypeChange]
};

export default function InfraExploreView() {
  return (
    <FixatedTimeConfigContextModification>
      {({ refresh }) => <InfraExploreViewWithFixatedTimeConfig refreshFixatedTimeConfig={refresh} />}
    </FixatedTimeConfigContextModification>
  );
}

function InfraExploreViewWithFixatedTimeConfig() {
  const timeConfig = useTimeConfig();
  const [{ tagFilterExpression, group, metrics: urlMetrics, type: urlType, order }, setUrl] = useUrlState(
    urlStateDefinition
  );
  const type = urlType === 'all' ? null : urlType;
  const setMetrics = useCallback(metrics => setUrl({ metrics }), [setUrl]);
  const setOrder = useCallback(order => setUrl({ order }), [setUrl]);

  const validTagFilterExpressionResult =
    useObservable(getIsQueryValidObservable, [tagFilterExpression, timeConfig]) ?? pendingResult;
  const validGroupResult = useObservable(getIsGroupingValidObservable, [group, timeConfig]) ?? pendingResult;
  // in case of a pending result (validTagFilterExpressionResult.data === null) we do not want to show the user an error message
  const isValid = validTagFilterExpressionResult.data === true && validGroupResult.data === true;
  const isInvalid = validTagFilterExpressionResult.data === false || validGroupResult.data === false;

  const backendQueryModel = useMemo(() => isValid && toBackendQueryModel(tagFilterExpression), [
    isValid,
    tagFilterExpression
  ]);

  const availableMetrics = useObservable(getMetricsObservable, [timeConfig, backendQueryModel, type]) || [];
  const metrics = fromUrlMetrics({ urlMetrics, availableMetrics });

  const onTagFilterExpressionChange = useCallback(tagFilterExpression => setUrl({ tagFilterExpression }), [setUrl]);
  const onGroupChange = useCallback(group => setUrl({ group }), [setUrl]);

  const getInfraExploreState = () => {
    return { type, tagFilterExpression, group, metrics, order };
  };

  const infrastructureListTrackingConfig = {
    onNavigateToEntity: navigateToEntityTracker(getInfraExploreState),
    onMetricAdded: metricAddedTracker(getInfraExploreState),
    onMetricRemoved: metricRemovedTracker(getInfraExploreState),
    onMetricAggregationChanged: metricAggregationChangedTracker(getInfraExploreState)
  };

  return (
    <InfraPageHeaderWithTabs
      onTypeSelected={typeSelectorChangedTracker(getInfraExploreState)}
      showSearchBar={false}
      theme={themes.light}
      addShadow
      addFooter
    >
      <ViewTrackingMeta
        data={{
          productArea: 'Infrastructure',
          pageRootName: 'Infra Explore'
        }}
      />

      <Title title="Explore" />
      <LeftRightPadding className={locals.stack}>
        <Stack space="gutter">
          <Message type={warning} withIcon small>
            This is a beta version of a new product capability. We advise you not to rely on the data presented.
          </Message>

          <Sections>
            <QueryBuilderSection
              value={tagFilterExpression}
              QueryBuilder={QueryBuilder}
              onChange={onTagFilterExpressionChange}
              tracking={{
                onTagAdded: filterAddedTracker(getInfraExploreState),
                onTagRemoved: filterRemovedTracker(getInfraExploreState),
                onQueryCleared: filtersClearedTracker(getInfraExploreState)
              }}
              hasError={isInvalid}
            />

            <GroupingConfiguratorSection
              value={group}
              GroupingConfigurator={GroupingConfigurator}
              tagFilterExpression={backendQueryModel || toBackendQueryModel([])}
              onChange={onGroupChange}
              tracking={{
                onGroupAdded: groupAddedTracker(getInfraExploreState),
                onGroupRemoved: groupRemovedTracker(getInfraExploreState)
              }}
            />

            <ActionSection right={<ApiQueryAction backendQueryModel={backendQueryModel} />} />
          </Sections>

          {isInvalid && (
            <Message type={error} withIcon small>
              The query configuration is invalid. Please address the validation failures before continuing.
            </Message>
          )}

          {isValid && !group?.groupbyTag && (
            <InfrastructureList
              backendQueryModel={backendQueryModel}
              availableMetrics={availableMetrics}
              timeConfig={timeConfig}
              setMetrics={setMetrics}
              setOrder={order => {
                setOrder(order);
                sortingTracker(getInfraExploreState)(order, SORTING_CONTEXT.ENTITIES);
              }}
              metrics={metrics}
              type={type}
              order={order}
              showHeader
              tracking={{
                onLoadMore: page => loadMoreTracker(getInfraExploreState)(page, LOAD_MORE_CONTEXT.UNGROUPED_ENTITIES),
                ...infrastructureListTrackingConfig
              }}
            />
          )}

          {isValid && group?.groupbyTag && (
            <GroupedInfrastructure
              tagFilterExpression={tagFilterExpression}
              backendQueryModel={backendQueryModel}
              availableMetrics={availableMetrics}
              timeConfig={timeConfig}
              setMetrics={setMetrics}
              setOrder={order => {
                setOrder(order);
                sortingTracker(getInfraExploreState)(order, SORTING_CONTEXT.GROUPS);
              }}
              metrics={metrics}
              type={type}
              group={group}
              order={order}
              tracking={{
                onFocusOnGroup: groupFocusedOnTracker(getInfraExploreState),
                onGroupExpanded: groupExpandedTracker(getInfraExploreState),
                onGroupCollapsed: groupCollapsedTracker(getInfraExploreState),
                onLoadMore: loadMoreTracker(getInfraExploreState),
                ...infrastructureListTrackingConfig
              }}
            />
          )}
        </Stack>
      </LeftRightPadding>
    </InfraPageHeaderWithTabs>
  );
}

function getIsQueryValidObservable([tagFilterExpression, timeConfig]) {
  return isQueryValid(tagFilterExpression, timeConfig);
}

function getIsGroupingValidObservable([group, timeConfig]) {
  return isGroupingConfigurationValid(group, timeConfig);
}

function getMetricsObservable([timeConfig, backendQueryModel, type]) {
  return getMetrics({ timeConfig, tagFilterExpression: backendQueryModel, type });
}
