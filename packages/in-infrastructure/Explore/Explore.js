/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React, { useCallback, useMemo } from 'react';

import { Message } from '@instana/components';
import { Stack } from '@instana/components';
import { just } from '@instana/observables';

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
  groupMatrixParameter,
  groupByMatrixParameter,
  orderMatrixParameter,
  typeMatrixParameter,
  chartedMetricsMatrixParameter,
  useLinkToExplore as useLinkToInfraEntityExplore,
  defaultInfraExploreViewParams
} from 'in-infrastructure/navigation/paths';
import GroupingConfigurator, {
  isGroupingConfigurationValid
} from 'in-infrastructure/Explore/components/GroupingConfigurator';
import GroupedInfrastructure, { toBackendGroupBy } from 'in-infrastructure/Explore/components/GroupedInfrastructure';
import { EMPTY_EXPRESSION, toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import GroupingConfiguratorSection from 'in-components/GroupingConfigurator/GroupingConfiguratorSection';
import FixatedTimeConfigContextModification from 'in-stores/time/FixatedTimeConfigContextModification';
import QueryBuilder, { isQueryValid } from 'in-infrastructure/Explore/components/QueryBuilder';
import QueryBuilderSection from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import { removeDuplicatesFromArrayObjects } from 'in-custom-dashboards/widgets/Chart/util';
import { getMetricKey, fromUrlMetrics } from 'in-infrastructure/Explore/services/metrics';
import InfrastructureList from 'in-infrastructure/Explore/components/InfrastructureList';
import ApiQueryAction from 'in-components/QueryBuilder/workspace/ApiQueryAction';
import { getUniqueMetricsLabels } from 'in-custom-dashboards/widgets/Chart/util';
import getMetricCatalog from 'in-infrastructure/subscriptions/getMetricCatalog';
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
import { mapData } from 'in-services/util/result';
import { noop } from 'in-services/util/function';
import useUrlState from 'in-hooks/useUrlState';
import Title from 'in-components/Title';
import config from 'in-services/config';
import { t } from 'in-i18n';

import locals from './Explore.mless';

const urlStateDefinition = {
  bind: [
    tagFilterExpressionMatrixParameter,
    groupMatrixParameter,
    groupByMatrixParameter,
    metricsMatrixParameter,
    orderMatrixParameter,
    typeMatrixParameter,
    chartedMetricsMatrixParameter
  ],
  resets: [resetMetricsAndOrderOnTypeChange],
  replaceHistory: false
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
  const getLinkToInfraEntityExplore = useLinkToInfraEntityExplore();
  const [
    {
      tagFilterExpression,
      group,
      groupBy: urlGroupBy,
      metrics: urlMetrics,
      type: urlType,
      order: urlOrder,
      chartedMetrics: urlChartedMetrics
    },
    setUrl
  ] = useUrlState(urlStateDefinition);
  const type = urlType === 'all' ? null : urlType;
  const groupBy = urlGroupBy ?? [group];

  const tagCatalog = useTagCatalog({ ownerType: type });
  const validTagFilterExpressionResult = isQueryValid(tagFilterExpression, tagCatalog);
  const validGroupResult = isGroupingConfigurationValid(group, tagCatalog);
  // in case of a pending result (validTagFilterExpressionResult.data === null) we do not want to show the user an error message
  const isValid = validTagFilterExpressionResult.data === true && validGroupResult.data === true;
  const isInvalid = validTagFilterExpressionResult.data === false || validGroupResult.data === false;

  const order = urlOrder ?? defaultOrder;

  const kpiDefinitions = getKpiDefinitions(type);
  const metrics = fromUrlMetrics({ urlMetrics, kpiDefinitions });
  const chartedMetrics = fromUrlMetrics({ urlMetrics: urlChartedMetrics, kpiDefinitions: kpiDefinitions.slice(0, 1) });

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
    (!groupBy || groupBy?.length === 0) &&
    (!metrics || metrics?.length === 0) &&
    (!tagFilterExpression || tagFilterExpression?.length === 0);

  return (
    <EntityExploreHeader
      onTypeSelected={typeSelectorChangedTracker(getInfraExploreState)}
      showSearchBar={false}
      theme={themes.light}
      addShadow
      addFooter
      headerHref$={isInitPage ? null : just(getLinkToInfraEntityExplore(defaultInfraExploreViewParams))}
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
            groupBy={groupBy}
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
            chartedMetrics={chartedMetrics}
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
  groupBy,
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
    [setUrl, order.by, order.direction]
  );
  const setOrder = useCallback(order => setUrl({ order }), [setUrl]);

  const onTagFilterExpressionChange = useCallback(tagFilterExpression => setUrl({ tagFilterExpression }), [setUrl]);
  const onChartedMetricsChange = useCallback(chartedMetrics => setUrl({ chartedMetrics }), [setUrl]);
  const onGroupChange = useCallback(groupBy => setUrl({ groupBy }), [setUrl]);

  const backendQueryModel = useMemo(
    () => (isValid ? toBackendQueryModel(tagFilterExpression) : undefined),
    [isValid, tagFilterExpression]
  );
  const pagination = { retrievalSize: 20 };

  const backendGroupBy = useMemo(() => toBackendGroupBy(groupBy), [groupBy]);

  const catalogQuery = useDebouncedValue('', noop, 800);
  const metricCatalog = useMetricCatalog({
    getMetricCatalog,
    tagFilterExpression: backendQueryModel,
    type,
    query: catalogQuery.debouncedValue
  });

  const metricMetadatas = useMetricMetadatas({ type, kpiDefinitions, query: catalogQuery.debouncedValue });

  const docLink = `https://instana.github.io/openapi/#operation${
    groupBy?.length > 0 ? '/getEntityGroups' : '/getEntities'
  }`;
  const endpointUrl = `https://${config.butlerDomain}/api/infrastructure-monitoring/analyze${
    groupBy?.length > 0 ? '/entity-groups' : '/entities'
  }`;

  const uniqueMetrics = getUniqueMetricsAndLabels(metrics, metricMetadatas);

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
        useLastValidStateWhenErroneous
      />

      <GroupingConfiguratorSection
        value={groupBy}
        GroupingConfigurator={GroupingConfigurator}
        tagCatalog={tagCatalog}
        tagFilterExpression={backendQueryModel || EMPTY_EXPRESSION}
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
            backendQueryModel={backendQueryModel || EMPTY_EXPRESSION}
            pagination={pagination}
            groupBy={backendGroupBy}
            type={type}
            metrics={uniqueMetrics}
            order={order}
            endpointUrl={endpointUrl}
            docsLink={docLink}
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
      metrics={uniqueMetrics}
      groupBy={groupBy}
      backendGroupBy={backendGroupBy}
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
      onChartedMetricsChange={onChartedMetricsChange}
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
  groupBy,
  backendGroupBy,
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
  onChartedMetricsChange,
  chartedMetrics
}) {
  const getLinkToInfraEntityExplore = useLinkToInfraEntityExplore();

  if (isInitPage) {
    return (
      <EntityList
        timeConfig={timeConfig}
        setOrder={order => {
          setUrl({ order });
          sortingTracker(getInfraExploreState)(order, SORTING_CONTEXT.GROUPS);
        }}
        order={order}
        type={type}
        headerHref$={just(getLinkToInfraEntityExplore(defaultInfraExploreViewParams))}
      />
    );
  }

  if (groupBy?.length > 0) {
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
        groupBy={groupBy}
        backendGroupBy={backendGroupBy}
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
      onChartedMetricsChange={onChartedMetricsChange}
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

function getUniqueMetricsAndLabels(metrics, metricMetadatas) {
  const uniqueMetrics = removeDuplicatesFromArrayObjects(metrics, ['metric', 'aggregation']).map(
    ({ metric, aggregation }) => ({
      metric,
      aggregation,
      label: mapData(metricMetadatas, data => data[metric]?.label)?.data
    })
  );

  const uniqueMetricsLabels = getUniqueMetricsLabels(uniqueMetrics);

  const uniqueMetricsWithLabels = uniqueMetrics.map((item, index) => ({
    ...item,
    label: uniqueMetricsLabels[index] || ''
  }));

  return uniqueMetricsWithLabels;
}
