/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React, { useCallback, useMemo } from 'react';

import { Message, Stack } from '@instana/components';
import { just } from '@instana/observables';

import {
  tagFilterExpressionMatrixParameter,
  resetMetricsAndOrderOnTypeChange,
  metricsMatrixParameter,
  tagsMatrixParameter,
  groupMatrixParameter,
  groupByMatrixParameter,
  orderMatrixParameter,
  typeMatrixParameter,
  chartedMetricsMatrixParameter,
  queryMatrixParameter,
  showGroupsWithMissingTagsParameter,
  useLinkToExplore as useLinkToInfraEntityExplore,
  defaultInfraExploreViewParams
} from 'in-infrastructure/navigation/paths';
import GroupingConfigurator, {
  isGroupingConfigurationValid
} from 'in-infrastructure/Explore/components/GroupingConfigurator';
import { EMPTY_EXPRESSION, toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { removeDuplicatesFromArrayObjects, getUniqueMetricsLabels } from 'in-custom-dashboards/widgets/Chart/util';
import GroupingConfiguratorSection from 'in-components/GroupingConfigurator/GroupingConfiguratorSection';
import FixatedTimeConfigContextModification from 'in-stores/time/FixatedTimeConfigContextModification';
import { getDefaultOrder, getUpdatedOrder, toBackendGroupBy } from 'in-infrastructure/Explore/utils';
import { LOAD_MORE_CONTEXT, SORTING_CONTEXT } from 'in-infrastructure/Explore/services/tracking';
import GroupedInfrastructure from 'in-infrastructure/Explore/components/GroupedInfrastructure';
import QueryBuilder, { isQueryValid } from 'in-infrastructure/Explore/components/QueryBuilder';
import QueryBuilderSection from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import InfrastructureList from 'in-infrastructure/Explore/components/InfrastructureList';
import EntityExploreHeader from 'in-infrastructure/components/EntityExploreHeader';
import ApiQueryAction from 'in-components/QueryBuilder/workspace/ApiQueryAction';
import { useSegmentTracker } from 'in-infrastructure/Explore/services/tracking';
import getMetricCatalog from 'in-infrastructure/subscriptions/getMetricCatalog';
import { fromUrlMetrics } from 'in-infrastructure/Explore/services/metrics';
import useMetricMetadatas from 'in-infrastructure/hooks/useMetricMetadatas';
import EntityList from 'in-infrastructure/Explore/components/EntityList';
import useMetricCatalog from 'in-infrastructure/hooks/useMetricCatalog';
import { themes } from 'in-components/DashboardHeader/DashboardHeader';
import { ActionSection } from 'in-components/workspace/ActionSection';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import useTagCatalog from 'in-infrastructure/hooks/useTagCatalog';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { pageNames } from 'in-services/tracking/pageNames';
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
    tagsMatrixParameter,
    orderMatrixParameter,
    typeMatrixParameter,
    chartedMetricsMatrixParameter,
    queryMatrixParameter,
    showGroupsWithMissingTagsParameter
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
  const {
    navigateToEntityTracker,
    metricAddedTracker,
    metricRemovedTracker,
    metricAggregationChangedTracker,
    typeSelectorChangedTracker,
    chartChangedTracker
  } = useSegmentTracker();

  const [
    {
      tagFilterExpression,
      group,
      groupBy: urlGroupBy,
      metrics: urlMetrics,
      tags,
      type: urlType,
      order: urlOrder,
      chartedMetrics: urlChartedMetrics,
      query: urlQuery,
      showGroupsWithMissingTags
    },
    setUrl
  ] = useUrlState(urlStateDefinition);
  const type = urlType === 'all' ? null : urlType;
  const groupBy = useMemo(() => urlGroupBy ?? [group], [urlGroupBy, group]);

  const tagCatalog = useTagCatalog({ ownerType: type });
  const validTagFilterExpressionResult = isQueryValid(tagFilterExpression, tagCatalog);
  const validGroupResult = isGroupingConfigurationValid(group, tagCatalog);
  // in case of a pending result (validTagFilterExpressionResult.data === null) we do not want to show the user an error message
  const isValid =
    tagFilterExpression.length === 0 ||
    (validTagFilterExpressionResult.data === true && validGroupResult.data === true);
  const isInvalid =
    tagFilterExpression.length > 0 &&
    (validTagFilterExpressionResult.data === false || validGroupResult.data === false);

  const backendGroupBy = useMemo(() => toBackendGroupBy(groupBy), [groupBy]);

  const order = urlOrder ?? getDefaultOrder(backendGroupBy);

  const query = useDebouncedValue(urlQuery ?? '', value => setUrl({ query: value }), 800);

  const kpiDefinitions = getKpiDefinitions(type);
  const metrics = fromUrlMetrics({ urlMetrics, kpiDefinitions });
  const chartedMetrics = fromUrlMetrics({ urlMetrics: urlChartedMetrics, kpiDefinitions: kpiDefinitions.slice(0, 1) });

  const getInfraExploreState = useCallback(() => {
    return { type, tagFilterExpression, group, metrics, tags, order };
  }, [type, tagFilterExpression, group, metrics, tags, order]);

  const infrastructureListTrackingConfig = {
    onNavigateToEntity: navigateToEntityTracker(getInfraExploreState),
    onMetricAdded: metricAddedTracker(getInfraExploreState),
    onMetricRemoved: metricRemovedTracker(getInfraExploreState),
    onMetricAggregationChanged: metricAggregationChangedTracker(getInfraExploreState),
    onChartChanged: chartChangedTracker(getInfraExploreState)
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
          productArea: productAreas.infrastructure,
          pageRootName: pageNames.infra_explore
        }}
      />

      <Title title={t('in-infrastructure:explore.explore')} />
      <LeftRightPadding className={locals.stack}>
        <Stack gap="gutter">
          <Content
            setUrl={setUrl}
            type={type}
            metrics={metrics}
            tags={tags}
            groupBy={groupBy}
            order={order}
            query={query.value}
            setQuery={query.onChange}
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
            backendGroupBy={backendGroupBy}
            showGroupsWithMissingTags={showGroupsWithMissingTags}
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
  tags,
  groupBy,
  order,
  query,
  setQuery,
  tagFilterExpression,
  isInitPage,
  isValid,
  isInvalid,
  timeConfig,
  infrastructureListTrackingConfig,
  getInfraExploreState,
  kpiDefinitions,
  tagCatalog,
  chartedMetrics,
  backendGroupBy,
  showGroupsWithMissingTags
}) {
  const setMetrics = useCallback(
    metrics => setUrl({ metrics, order: getUpdatedOrder(order, metrics, backendGroupBy) }),
    [setUrl, order, backendGroupBy]
  );
  const setTags = useCallback(tags => setUrl({ tags }), [setUrl]);
  const setOrder = useCallback(order => setUrl({ order }), [setUrl]);

  const { filterAddedTracker, filterRemovedTracker, filtersClearedTracker, groupAddedTracker, groupRemovedTracker } =
    useSegmentTracker();

  const onTagFilterExpressionChange = useCallback(tagFilterExpression => setUrl({ tagFilterExpression }), [setUrl]);
  const onChartedMetricsChange = useCallback(chartedMetrics => setUrl({ chartedMetrics }), [setUrl]);
  const onGroupChange = useCallback(
    groupBy => setUrl({ groupBy, order: getUpdatedOrder(order, metrics, toBackendGroupBy(groupBy)) }),
    [setUrl, order, metrics]
  );

  const backendQueryModel = useMemo(
    () => (isValid ? toBackendQueryModel(tagFilterExpression) : undefined),
    [isValid, tagFilterExpression]
  );
  const pagination = { retrievalSize: 20 };

  const catalogQuery = useDebouncedValue('', noop, 800);

  const metricCatalog = useMetricCatalog({
    getMetricCatalog,
    tagFilterExpression: backendQueryModel,
    type,
    query: catalogQuery.debouncedValue,
    withHierarchy: false
  });

  const metricsIds = metrics.map(metric => metric.metric);
  const chartedMetricsIds = chartedMetrics.map(metric => metric.metric);
  const queries = [...metricsIds, ...chartedMetricsIds];

  if (catalogQuery.debouncedValue !== '') {
    queries.push(catalogQuery.debouncedValue);
  }

  const metricMetadatas = useMetricMetadatas({
    type,
    kpiDefinitions,
    queries
  });

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
        additionalGetTagCatalogProps={{ ownerType: type }}
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
        additionalGetTagCatalogProps={{ ownerType: type }}
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
    <Message type="error" withIcon small fullInlineWidth>
      {t('in-infrastructure:explore.theQueryConfigurationIsInvalid')}
    </Message>
  );

  const bottomSection = isInvalid ? (
    errorMessage
  ) : (
    <List
      type={type}
      metrics={uniqueMetrics}
      tags={tags}
      groupBy={groupBy}
      backendGroupBy={backendGroupBy}
      order={order}
      query={query}
      setQuery={setQuery}
      tagFilterExpression={tagFilterExpression}
      isInitPage={isInitPage}
      timeConfig={timeConfig}
      infrastructureListTrackingConfig={infrastructureListTrackingConfig}
      getInfraExploreState={getInfraExploreState}
      metricCatalog={metricCatalog}
      tagCatalog={tagCatalog}
      setOrder={setOrder}
      metricMetadatas={metricMetadatas}
      backendQueryModel={backendQueryModel}
      setMetrics={setMetrics}
      setTags={setTags}
      catalogQuery={catalogQuery}
      onChartedMetricsChange={onChartedMetricsChange}
      chartedMetrics={chartedMetrics}
      showGroupsWithMissingTags={showGroupsWithMissingTags}
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
  tags,
  groupBy,
  backendGroupBy,
  order,
  query,
  setQuery,
  tagFilterExpression,
  isInitPage,
  timeConfig,
  infrastructureListTrackingConfig,
  getInfraExploreState,
  metricCatalog,
  tagCatalog,
  setOrder,
  metricMetadatas,
  backendQueryModel,
  setMetrics,
  setTags,
  catalogQuery,
  onChartedMetricsChange,
  chartedMetrics,
  showGroupsWithMissingTags
}) {
  const getLinkToInfraEntityExplore = useLinkToInfraEntityExplore();

  const { sortingTracker, loadMoreTracker, groupFocusedOnTracker, groupExpandedTracker, groupCollapsedTracker } =
    useSegmentTracker();

  if (isInitPage) {
    return (
      <EntityList
        timeConfig={timeConfig}
        setOrder={order => {
          setOrder(order);
          sortingTracker(getInfraExploreState)(order, SORTING_CONTEXT.GROUPS);
        }}
        order={order}
        setQuery={setQuery}
        query={query}
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
        showGroupsWithMissingTags={showGroupsWithMissingTags}
      />
    );
  }

  return (
    <InfrastructureList
      tagFilterExpression={tagFilterExpression}
      backendQueryModel={backendQueryModel}
      timeConfig={timeConfig}
      setMetrics={setMetrics}
      setTags={setTags}
      setOrder={order => {
        setOrder(order);
        sortingTracker(getInfraExploreState)(order, SORTING_CONTEXT.ENTITIES);
      }}
      type={type}
      metrics={metrics}
      tags={tags}
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
      tagCatalog={(catalogQuery.value === catalogQuery.debouncedValue && tagCatalog) || pendingResult}
      query={catalogQuery.value}
      onQueryChange={catalogQuery.onChange}
    />
  );
}

export function getUniqueMetricsAndLabels(metrics, metricMetadatas) {
  const uniqueMetrics = removeDuplicatesFromArrayObjects(metrics, ['metric', 'aggregation']).map(item => ({
    ...item,
    label: mapData(metricMetadatas, data => data[item.metric]?.label)?.data ?? item.label
  }));

  const uniqueMetricsLabels = getUniqueMetricsLabels(uniqueMetrics);

  const uniqueMetricsWithLabels = uniqueMetrics.map((item, index) => ({
    ...item,
    label: uniqueMetricsLabels[index]
  }));

  return uniqueMetricsWithLabels;
}
