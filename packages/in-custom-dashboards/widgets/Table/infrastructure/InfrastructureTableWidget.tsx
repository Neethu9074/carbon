/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import {
  AggregationType,
  Group,
  TagFilterExpression,
  TagFilterExpressionElementUnion,
  Threshold
} from '@instana/types';
import { Card, Link, Spacer, Typography, SearchInput } from '@instana/components';

// @ts-expect-error
import FixatedTimeConfigContextModification from 'in-stores/time/FixatedTimeConfigContextModification';
// @ts-expect-error
import GroupedInfrastructure from 'in-infrastructure/Explore/components/GroupedInfrastructure';
import { removeDuplicatesFromArrayObjects, getUniqueMetricsLabels } from 'in-custom-dashboards/widgets/Chart/util';
// @ts-expect-error
import InfrastructureList from 'in-infrastructure/Explore/components/InfrastructureList';
import { useLinkToExplore as useLinkToInfraEntityExplore } from 'in-infrastructure/navigation/paths';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import getMetricCatalog from 'in-infrastructure/subscriptions/getMetricCatalog';
import WidgetCardHeader from 'in-components/WidgetCardHeader/WidgetCardHeader';
import { TableWidgetProps } from 'in-custom-dashboards/widgets/Table/types';
import useMetricMetadatas from 'in-infrastructure/hooks/useMetricMetadatas';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import useMetricCatalog from 'in-infrastructure/hooks/useMetricCatalog';
import { defaultOrder } from 'in-infrastructure/Explore/constants';
import { toBackendGroupBy } from 'in-infrastructure/Explore/utils';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { pendingResult } from 'in-services/fixedObjects';
import { getKpiDefinitions } from 'in-sdk/metrics/kpis';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { noop } from 'in-services/util/function';
import { seconds } from 'in-services/time/time';
import { Trans, t } from 'in-i18n';

import locals from 'in-custom-dashboards/widgets/Table/infrastructure/InfrastructureTableWidget.mless';

export interface MetricItem {
  aggregation: AggregationType;
  metric: string;
  formatter: string;
  formatterSelected: boolean;
  crossSeriesAggregation: AggregationType;
  metricLabel: string;
  label: string;
  regex: boolean;
  lastValue?: boolean;
  required?: boolean;
  unit?: string;
  threshold?: Threshold;
}

export default function InfrastructureTableWidget(props: TableWidgetProps) {
  const realTimeConfig = useTimeConfig();

  return (
    <FixatedTimeConfigContextModification>
      {({ refresh }: { refresh: () => void }) => (
        <InfrastructureTable {...props} refreshFixatedTimeConfig={refresh} realTimeConfig={realTimeConfig} />
      )}
    </FixatedTimeConfigContextModification>
  );
}

function InfrastructureTable(props: TableWidgetProps) {
  const getLinkToInfraEntityExplore = useLinkToInfraEntityExplore();
  const { goToPath } = useNavigation();
  const [totalItemsCount, setTotalItemsCount] = useState();

  const {
    config,
    title,
    actions,
    dragHandle,
    isInModal,
    isPreview,
    topLevelFilterNote,
    realTimeConfig,
    refreshFixatedTimeConfig
  } = props;

  useEffect(() => {
    let interval: NodeJS.Timer;

    if (!isPreview && realTimeConfig.autoRefresh) {
      interval = setInterval(refreshFixatedTimeConfig, seconds.toMillis(10));
    }

    return () => (interval ? clearInterval(interval) : undefined);
  }, [isPreview, realTimeConfig, refreshFixatedTimeConfig]);

  const {
    entityType: type = '',
    grouping: groupBy,
    datasets,
    sorting = defaultOrder,
    tableSize = 5,
    tagFilterExpression: baseTagFilterExpression,
    countGroup: isCounterVisible = true,
    showGroupsWithMissingTags
  } = config;

  const isGroup = groupBy && groupBy?.length > 0;
  const [tagFilterExpression, setTagFilterExpression] = useState(baseTagFilterExpression);

  const isShowResultsVisible = tableSize > 0 && totalItemsCount;

  const kpiDefinitions = getKpiDefinitions(type);

  const [order, setOrder] = useState(sorting);
  const [query, setQuery] = useState('');

  // Update order and total items count in case it gets changed
  useEffect(() => {
    setOrder(sorting);
    setTotalItemsCount(undefined);

    if (query === '') {
      setTagFilterExpression(baseTagFilterExpression);
    }
  }, [sorting, tagFilterExpression, baseTagFilterExpression, query]);

  const metricsArray = datasets?.metrics ?? [];
  const metrics = getUniqueMetricsAndLabels(metricsArray);
  const metricsIds = metrics.map(metric => metric.metric);

  const metricMetadatas = useMetricMetadatas({ type, queries: metricsIds, kpiDefinitions });

  const handleQuery = (query: string) => {
    setQuery(query);

    getTagFilterExpressionFromQuery({
      query,
      backendGroupBy,
      tagFilterExpression: baseTagFilterExpression,
      setTagFilterExpression
    });
  };

  const catalogQuery = useDebouncedValue('', noop, 800);
  const debouncedQuery = useDebouncedValue(query, handleQuery, 800);

  const metricCatalog = useMetricCatalog({
    getMetricCatalog,
    tagFilterExpression,
    type,
    query: catalogQuery.debouncedValue,
    withHierarchy: false
  });

  const backendGroupBy = useMemo(() => toBackendGroupBy(groupBy), [groupBy]);

  const handleItemClick = (href: string) => {
    if (isPreview || !href) {
      return;
    }

    goToPath(href);
  };

  const viewFullTableHref = getLinkToInfraEntityExplore({
    type,
    metrics,
    group: {} as Group,
    groupBy,
    tagFilterExpression: fromBackendModel(tagFilterExpression as TagFilterExpressionElementUnion),
    showGroupsWithMissingTags
  });

  return (
    <Card
      className={classNames({
        [locals.widgetCard]: true,
        [locals.modal]: isInModal
      })}
      bodyClassName={classNames({
        [locals.modal]: isInModal
      })}
      title={isInModal ? undefined : title}
      leftHeaderContent={isInModal ? undefined : <WidgetCardHeader extraInfoTooltip={topLevelFilterNote} />}
      rightHeaderContent={
        isInModal ? undefined : (
          <>
            {dragHandle}
            {actions}
          </>
        )
      }
      isScrollable
    >
      <div className={locals.wrapper}>
        <div className={locals.header}>
          <div>
            {isShowResultsVisible && (
              <div className="show-results">
                <Typography variant="body-bold">
                  {t('in-custom-dashboards:widgets.table.form.infrastructure.showResult', {
                    loadedItems: Math.min(tableSize, totalItemsCount),
                    totalItems: totalItemsCount
                  })}
                </Typography>
              </div>
            )}
          </div>

          {!isPreview && (
            <SearchInput
              className="search-input"
              placeholder={t('in-custom-dashboards:widgets.table.form.infrastructure.searchPlaceholder')}
              onChange={debouncedQuery.onChange}
              query={debouncedQuery.value}
            />
          )}
        </div>

        <Spacer vertical="normal" />

        {isGroup ? (
          <GroupedInfrastructure
            backendQueryModel={tagFilterExpression}
            backendGroupBy={backendGroupBy}
            getTotalItems={setTotalItemsCount}
            groupBy={groupBy}
            isHeaderVisible={false}
            isLoadMoreEnabled={false}
            isTableMode
            isCounterVisible={isCounterVisible}
            isPreview={isPreview}
            onItemClicked={handleItemClick}
            metricCatalog={(catalogQuery.value === catalogQuery.debouncedValue && metricCatalog) || pendingResult}
            metrics={metrics}
            metricMetadatas={metricMetadatas}
            retrievalSize={tableSize}
            order={order}
            setOrder={setOrder}
            type={type}
            query={debouncedQuery.value}
            onQueryChange={debouncedQuery.onChange}
            showGroupsWithMissingTags={showGroupsWithMissingTags}
          />
        ) : (
          <InfrastructureList
            backendQueryModel={tagFilterExpression}
            displayChart={false}
            getTotalItems={setTotalItemsCount}
            isLoadMoreEnabled={false}
            isPreview={isPreview}
            isSearchable
            metrics={metrics}
            metricMetadatas={metricMetadatas}
            showHeader={false}
            order={order}
            setOrder={setOrder}
            type={type}
            sortableMetrics
            retrievalSize={tableSize}
            numSkeletonRows={tableSize}
            chartedMetrics={[]}
            metricCatalog={(catalogQuery.value === catalogQuery.debouncedValue && metricCatalog) || pendingResult}
            query={debouncedQuery.value}
            onQueryChange={debouncedQuery.onChange}
            isWidget
            isLiveModeEnabled={realTimeConfig.autoRefresh}
          />
        )}

        {viewFullTableHref && (
          <div
            className={classNames('view-full-table', {
              [locals.viewFullTableLink]: true
            })}
          >
            <Typography variant="body-regular">
              <Trans
                i18nKey="in-custom-dashboards:widgets.table.form.infrastructure.viewTable"
                components={{
                  analyzeInfraLink: (
                    // @ts-expect-error
                    <Link href={isPreview ? undefined : viewFullTableHref} />
                  )
                }}
              />
            </Typography>
          </div>
        )}
      </div>
    </Card>
  );
}

function getUniqueMetricsAndLabels(metrics: MetricItem[]) {
  const uniqueMetrics = removeDuplicatesFromArrayObjects(metrics, ['metric', 'aggregation']).map(
    ({
      aggregation,
      crossSeriesAggregation,
      metric,
      formatter,
      formatterSelected: isFormatterSelected,
      label,
      metricLabel,
      regex,
      lastValue,
      required,
      unit,
      threshold
    }) => ({
      aggregation,
      crossSeriesAggregation,
      formatterId: formatter,
      label: label !== '' ? label : metricLabel,
      metricLabel,
      metric,
      isFormatterSelected,
      regex,
      lastValue,
      required,
      unit,
      threshold
    })
  );

  const uniqueMetricsLabels = getUniqueMetricsLabels(uniqueMetrics);

  const uniqueMetricsWithLabels = uniqueMetrics.map((item, index) => ({
    ...item,
    label: uniqueMetricsLabels[index] || ''
  }));

  return uniqueMetricsWithLabels;
}

function getTagFilterExpressionFromQuery({
  backendGroupBy,
  query,
  tagFilterExpression,
  setTagFilterExpression
}: {
  backendGroupBy: string[];
  query: string;
  setTagFilterExpression: React.Dispatch<React.SetStateAction<TagFilterExpressionElementUnion>>;
  tagFilterExpression: TagFilterExpressionElementUnion;
}) {
  if (query.trim() !== '') {
    const tagFiltersFromEntity = tagFilter('label', 'CONTAINS', query);
    const tagFiltersFromGroups = backendGroupBy.map((group: string) => tagFilter(group, 'CONTAINS', query));

    const updatedTagFilterExpression: TagFilterExpression = {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: [
        tagFilterExpression as TagFilterExpressionElementUnion,
        {
          type: 'EXPRESSION',
          logicalOperator: 'OR',
          elements: [tagFiltersFromEntity, ...tagFiltersFromGroups]
        }
      ]
    };

    setTagFilterExpression(updatedTagFilterExpression);
  } else {
    setTagFilterExpression(tagFilterExpression);
  }
}
