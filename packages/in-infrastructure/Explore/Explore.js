/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React, { useCallback, useMemo } from 'react';

import { Message } from '@instana/components';
import { Stack } from '@instana/components';

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
  typeMatrixParameter,
  chartedMetricsMatrixParameter
} from 'in-infrastructure/navigation/paths';
import GroupingConfigurator, {
  isGroupingConfigurationValid
} from 'in-infrastructure/Explore/components/GroupingConfigurator';
import { EMPTY_EXPRESSION, toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import GroupingConfiguratorSection from 'in-components/GroupingConfigurator/GroupingConfiguratorSection';
import FixatedTimeConfigContextModification from 'in-stores/time/FixatedTimeConfigContextModification';
import QueryBuilder, { isQueryValid } from 'in-infrastructure/Explore/components/QueryBuilder';
import GroupedInfrastructure from 'in-infrastructure/Explore/components/GroupedInfrastructure';
import QueryBuilderSection from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import { getMetricKey, fromUrlMetrics } from 'in-infrastructure/Explore/services/metrics';
import InfrastructureList from 'in-infrastructure/Explore/components/InfrastructureList';
import ApiQueryAction from 'in-components/QueryBuilder/workspace/ApiQueryAction';
import getMetricCatalog from 'in-infrastructure/subscriptions/getMetricCatalog';
import { defaultInfraExploreView } from 'in-infrastructure/navigation/paths';
import useMetricMetadatas from 'in-infrastructure/hooks/useMetricMetadatas';
import EntityList from 'in-infrastructure/Explore/components/EntityList';
import useMetricCatalog from 'in-infrastructure/hooks/useMetricCatalog';
import { themes } from 'in-components/DashboardHeader/DashboardHeader';
import { ActionSection } from 'in-components/workspace/ActionSection';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import EntityExploreHeader from '../components/EntityExploreHeader';
import { defaultOrder } from 'in-infrastructure/Explore/constants';
import useTagCatalog from 'in-infrastructure/hooks/useTagCatalog';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { pendingResult } from 'in-services/fixedObjects';
import Sections from 'in-components/workspace/Sections';
import { getKpiDefinitions } from 'in-sdk/metrics/kpis';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { noop } from 'in-services/util/function';
import useUrlState from 'in-hooks/useUrlState';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './Explore.mless';

const urlStateDefinition = {
  bind: [
    tagFilterExpressionMatrixParameter,
    groupMatrixParameter,
    chartsMatrixParameter,
    metricsMatrixParameter,
    orderMatrixParameter,
    typeMatrixParameter,
    chartedMetricsMatrixParameter
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
  const [
    {
      tagFilterExpression,
      group,
      metrics: urlMetrics,
      type: urlType,
      order: urlOrder,
      chartedMetrics: urlChartedMetrics
    },
    setUrl
  ] = useUrlState(urlStateDefinition);
  const type = urlType === 'all' ? null : urlType;

  const tagCatalog = useTagCatalog({ ownerType: type });
  const validTagFilterExpressionResult = isQueryValid(tagFilterExpression, tagCatalog);
  const validGroupResult = isGroupingConfigurationValid(group, tagCatalog);
  // in case of a pending result (validTagFilterExpressionResult.data === null) we do not want to show the user an error message
  const isValid = validTagFilterExpressionResult.data === true && validGroupResult.data === true;
  const isInvalid = validGroupResult.data === false;

  const order = urlOrder ?? defaultOrder;

  const kpiDefinitions = getKpiDefinitions(type);
  const metrics = fromUrlMetrics({ urlMetrics, kpiDefinitions });

  const getInfraExploreState = () => {
    return { type, tagFilterExpression, group, metrics, order };
  };

  const infrastructureListTrackingConfig = {
    onNavigateToEntity: navigateToEntityTracker(getInfraExploreState),
    onMetricAdded: metricAddedTracker(getInfraExploreState),
    onMetricRemoved: metricRemovedTracker(getInfraExploreState),
    onMetricAggregationChanged: metricAggregationChangedTracker(getInfraExploreState)
  };

  const isInitPage =
    !type &&
    (!group || group?.groupbyTag == 'type') &&
    (!metrics || metrics?.length == 0) &&
    (!tagFilterExpression || tagFilterExpression?.length == 0);

  return (
    <EntityExploreHeader
      onTypeSelected={typeSelectorChangedTracker(getInfraExploreState)}
      showSearchBar={false}
      theme={themes.light}
      addShadow
      addFooter
      headerHref$={isInitPage ? null : defaultInfraExploreView}
      renderTypeSelector={!isInitPage}
    >
      <ViewTrackingMeta
        data={{
          productArea: 'Infrastructure',
          pageRootName: 'Infra Explore'
        }}
      />

      <Title title={t('in-infrastructure:explore.explore')} />
      <LeftRightPadding className={locals.stack}>
        <Stack gap="gutter">
          <Content
            setUrl={setUrl}
            type={type}
            metrics={metrics}
            group={group}
            order={order}
            tagFilterExpression={tagFilterExpression}
            isInitPage={isInitPage}
            isValid={isValid}
            isInvalid={isInvalid}
            timeConfig={timeConfig}
            infrastructureListTrackingConfig={infrastructureListTrackingConfig}
            getInfraExploreState={getInfraExploreState}
            kpiDefinitions={kpiDefinitions}
            tagCatalog={tagCatalog}
            refreshFixatedTimeConfig={() => {}}
            chartedMetrics={urlChartedMetrics}
          />
        </Stack>
      </LeftRightPadding>
    </EntityExploreHeader>
  );
}

function Content({
  setUrl,
  type,
  metrics,
  group,
  order,
  tagFilterExpression,
  isInitPage,
  isValid,
  isInvalid,
  timeConfig,
  infrastructureListTrackingConfig,
  getInfraExploreState,
  kpiDefinitions,
  tagCatalog,
  chartedMetrics
}) {
  const setMetrics = useCallback(
    metrics => {
      const sortedMetric = metrics.find(metric => order.by.startsWith(metric.metric));
      const newOrder =
        (sortedMetric && {
          by: getMetricKey(sortedMetric.metric, sortedMetric.aggregation),
          direction: order.direction
        }) ??
        defaultOrder;
      setUrl({ metrics, order: newOrder });
    },
    [setUrl]
  );
  const setOrder = useCallback(order => setUrl({ order }), [setUrl]);

  const onTagFilterExpressionChange = useCallback(tagFilterExpression => setUrl({ tagFilterExpression }), [setUrl]);
  const onChartedMetricChange = useCallback(chartedMetric => setUrl({ chartedMetrics: chartedMetric }), [setUrl]);
  const onGroupChange = useCallback(group => setUrl({ group }), [setUrl]);

  const backendQueryModel = useMemo(
    () => (isValid && toBackendQueryModel(tagFilterExpression)) || EMPTY_EXPRESSION,
    [isValid, tagFilterExpression]
  );
  const pagination = { retrievalSize: 20 };

  let groupBy;
  if (group) {
    groupBy = group.groupbyTagSecondLevelKey
      ? [group.groupbyTag + '.' + group.groupbyTagSecondLevelKey]
      : [group.groupbyTag];
  } else {
    groupBy = [];
  }

  const catalogQuery = useDebouncedValue('', noop, 800);
  const metricCatalog = useMetricCatalog({
    getMetricCatalog,
    tagFilterExpression: backendQueryModel,
    type,
    query: catalogQuery.debouncedValue
  });

  if (
    chartedMetrics !== undefined &&
    chartedMetrics.length > 0 &&
    !metrics.some(
      item => item.metric === chartedMetrics[0]?.metricId && item.aggregation === chartedMetrics[0]?.aggregationId
    )
  ) {
    metrics.push({
      metric: chartedMetrics[0]?.metricId,
      aggregation: chartedMetrics[0]?.aggregationId,
      removeFromTable: true
    });
  }

  const metricMetadatas = useMetricMetadatas({ type, metrics, kpiDefinitions });

  const topSection = !isInitPage && (
    <Sections>
      <QueryBuilderSection
        value={tagFilterExpression}
        QueryBuilder={QueryBuilder}
        tagCatalog={tagCatalog}
        onChange={onTagFilterExpressionChange}
        tracking={{
          onTagAdded: filterAddedTracker(getInfraExploreState),
          onTagRemoved: filterRemovedTracker(getInfraExploreState),
          onQueryCleared: filtersClearedTracker(getInfraExploreState)
        }}
        hasError={isInvalid}
        allowEmptyKey
      />

      <GroupingConfiguratorSection
        value={group}
        GroupingConfigurator={GroupingConfigurator}
        tagCatalog={tagCatalog}
        tagFilterExpression={backendQueryModel || toBackendQueryModel([])}
        onChange={onGroupChange}
        tracking={{
          onGroupAdded: groupAddedTracker(getInfraExploreState),
          onGroupRemoved: groupRemovedTracker(getInfraExploreState)
        }}
      />

      <ActionSection
        right={
          <ApiQueryAction
            timeFrame={(({ to, windowSize }) => ({ to, windowSize }))(timeConfig)}
            backendQueryModel={backendQueryModel}
            pagination={pagination}
            groupBy={groupBy}
            type={type}
            metrics={metrics}
            order={order}
          />
        }
      />
    </Sections>
  );

  const errorMessage = (
    <Message type="error" withIcon small>
      {t('in-infrastructure:explore.theQueryConfigurationIsInvalid')}
    </Message>
  );

  const bottomSection = isInvalid ? (
    errorMessage
  ) : (
    <List
      type={type}
      metrics={metrics}
      group={group}
      order={order}
      tagFilterExpression={tagFilterExpression}
      isInitPage={isInitPage}
      timeConfig={timeConfig}
      infrastructureListTrackingConfig={infrastructureListTrackingConfig}
      getInfraExploreState={getInfraExploreState}
      metricCatalog={metricCatalog}
      setOrder={setOrder}
      setUrl={setUrl}
      metricMetadatas={metricMetadatas}
      backendQueryModel={backendQueryModel}
      setMetrics={setMetrics}
      catalogQuery={catalogQuery}
      onChartedMetricChange={onChartedMetricChange}
      chartedMetrics={chartedMetrics}
    />
  );

  return (
    <>
      {topSection}
      {bottomSection}
    </>
  );
}

function List({
  type,
  metrics,
  group,
  order,
  tagFilterExpression,
  isInitPage,
  timeConfig,
  infrastructureListTrackingConfig,
  getInfraExploreState,
  metricCatalog,
  setOrder,
  setUrl,
  metricMetadatas,
  backendQueryModel,
  setMetrics,
  catalogQuery,
  onChartedMetricChange,
  chartedMetrics
}) {
  if (isInitPage) {
    return (
      <EntityList
        backendQueryModel={backendQueryModel}
        timeConfig={timeConfig}
        group={group}
        setOrder={order => {
          setUrl({ order });
          sortingTracker(getInfraExploreState)(order, SORTING_CONTEXT.GROUPS);
        }}
        order={order}
        type={type}
        headerHref$={defaultInfraExploreView}
      />
    );
  }

  if (group?.groupbyTag) {
    return (
      <GroupedInfrastructure
        tagFilterExpression={tagFilterExpression}
        backendQueryModel={backendQueryModel}
        timeConfig={timeConfig}
        setMetrics={setMetrics}
        setOrder={order => {
          setOrder(order);
          sortingTracker(getInfraExploreState)(order, SORTING_CONTEXT.GROUPS);
        }}
        metrics={metrics}
        metricMetadatas={metricMetadatas}
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
        metricCatalog={(catalogQuery.value === catalogQuery.debouncedValue && metricCatalog) || pendingResult}
        query={catalogQuery.value}
        onQueryChange={catalogQuery.onChange}
      />
    );
  }

  return (
    <InfrastructureList
      tagFilterExpression={tagFilterExpression}
      backendQueryModel={backendQueryModel}
      timeConfig={timeConfig}
      setMetrics={setMetrics}
      setOrder={order => {
        setOrder(order);
        sortingTracker(getInfraExploreState)(order, SORTING_CONTEXT.ENTITIES);
      }}
      type={type}
      metrics={metrics}
      metricMetadatas={metricMetadatas}
      order={order}
      onChartedMetricChange={onChartedMetricChange}
      chartedMetrics={chartedMetrics}
      showHeader
      tracking={{
        onLoadMore: page => loadMoreTracker(getInfraExploreState)(page, LOAD_MORE_CONTEXT.UNGROUPED_ENTITIES),
        ...infrastructureListTrackingConfig
      }}
      metricCatalog={(catalogQuery.value === catalogQuery.debouncedValue && metricCatalog) || pendingResult}
      query={catalogQuery.value}
      onQueryChange={catalogQuery.onChange}
      setUrl={setUrl}
    />
  );
}
