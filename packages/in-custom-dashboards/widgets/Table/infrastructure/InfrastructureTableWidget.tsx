/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useMemo, useState } from 'react';

import { Card, Link, Spacer, Typography } from '@instana/components';

// @ts-expect-error
import GroupedInfrastructure, { toBackendGroupBy } from 'in-infrastructure/Explore/components/GroupedInfrastructure';
// @ts-expect-error
import FixatedTimeConfigContextModification from 'in-stores/time/FixatedTimeConfigContextModification';
// @ts-expect-error needs to be ts migrated
import { defaultOrder } from 'in-infrastructure/Explore/constants';
// @ts-expect-error
import InfrastructureList from 'in-infrastructure/Explore/components/InfrastructureList';
import { useLinkToExplore as useLinkToInfraEntityExplore } from 'in-infrastructure/navigation/paths';
import { removeDuplicatesFromArrayObjects } from 'in-custom-dashboards/widgets/Chart/util';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { AggregationType, Group, TagFilterExpressionElementUnion } from 'in-types';
import { getUniqueMetricsLabels } from 'in-custom-dashboards/widgets/Chart/util';
import getMetricCatalog from 'in-infrastructure/subscriptions/getMetricCatalog';
import { TableWidgetProps } from 'in-custom-dashboards/widgets/Table/types';
import useMetricMetadatas from 'in-infrastructure/hooks/useMetricMetadatas';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import useMetricCatalog from 'in-infrastructure/hooks/useMetricCatalog';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { pendingResult } from 'in-services/fixedObjects';
import { getKpiDefinitions } from 'in-sdk/metrics/kpis';
import { noop } from 'in-services/util/function';
import { Trans, t } from 'in-i18n';

import locals from 'in-custom-dashboards/widgets/Table/infrastructure/InfrastructureTableWidget.mless';

interface MetricItem {
  aggregation: AggregationType;
  metric: string;
  formatter: string;
  crossSeriesAggregation: string;
  metricLabel: string;
}

export default function InfrastructureTableWidget(props: TableWidgetProps) {
  return (
    <FixatedTimeConfigContextModification>
      {() => <InfrastructureTable {...props} />}
    </FixatedTimeConfigContextModification>
  );
}

function InfrastructureTable(props: TableWidgetProps) {
  const getLinkToInfraEntityExplore = useLinkToInfraEntityExplore();
  const { goToPath } = useNavigation();
  const [totalItemsCount, setTotalItemsCount] = useState();

  const { config, title, actions, dragHandle, isPreview } = props;

  const {
    entityType: type = '',
    grouping: groupBy,
    datasets,
    sorting = defaultOrder,
    tableSize = 5,
    tagFilterExpression
  } = config;

  const isGroup = groupBy && groupBy?.length > 0;

  const loadedItemsCount = totalItemsCount && Math.min(totalItemsCount, tableSize);
  const isShowResultsVisible = loadedItemsCount && totalItemsCount;

  const kpiDefinitions = getKpiDefinitions(type);
  const metricMetadatas = useMetricMetadatas({ type, kpiDefinitions });

  const [order, setOrder] = useState(sorting);

  // Update order and  total items count in case it gets changed
  useEffect(() => {
    setOrder(sorting);
    setTotalItemsCount(undefined);
  }, [sorting, tagFilterExpression]);

  const metricsArray = datasets?.metrics ?? [];
  const metrics = getUniqueMetricsAndLabels(metricsArray);

  const catalogQuery = useDebouncedValue('', noop, 800);
  const metricCatalog = useMetricCatalog({
    getMetricCatalog,
    // @ts-expect-error
    tagFilterExpression,
    type,
    query: catalogQuery.debouncedValue
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
    tagFilterExpression: fromBackendModel(tagFilterExpression as TagFilterExpressionElementUnion)
  });

  return (
    <Card
      className={locals.widgetCard}
      leftHeaderContent={<Typography variant="heading-300">{title}</Typography>}
      rightHeaderContent={
        <>
          {dragHandle}
          {actions}
        </>
      }
      isScrollable
    >
      {isShowResultsVisible && (
        <Typography variant="body-bold">
          {t('in-custom-dashboards:widgets.table.form.infrastructure.showResult', {
            loadedItems: loadedItemsCount,
            totalItems: totalItemsCount
          })}
        </Typography>
      )}

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
          isPreview={isPreview}
          onItemClicked={handleItemClick}
          metricCatalog={(catalogQuery.value === catalogQuery.debouncedValue && metricCatalog) || pendingResult}
          metrics={metrics}
          metricMetadatas={metricMetadatas}
          retrievalSize={tableSize}
          order={order}
          setOrder={setOrder}
          tagFilterExpression={[]}
          type={type}
          query={catalogQuery.value}
          onQueryChange={catalogQuery.onChange}
        />
      ) : (
        <InfrastructureList
          tagFilterExpression={[tagFilterExpression]}
          backendQueryModel={tagFilterExpression}
          displayChart={false}
          getTotalItems={setTotalItemsCount}
          isLoadMoreEnabled={false}
          isPreview={isPreview}
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
          query={catalogQuery.value}
          onQueryChange={catalogQuery.onChange}
          isWidget
        />
      )}

      {viewFullTableHref && (
        <div className={locals.viewFullTableLink}>
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
    </Card>
  );
}

function getUniqueMetricsAndLabels(metrics: MetricItem[]) {
  const uniqueMetrics = removeDuplicatesFromArrayObjects(metrics, ['metric', 'aggregation']).map(
    ({ aggregation, metric, formatter, metricLabel }) => ({
      aggregation,
      formatterId: formatter,
      label: metricLabel,
      metricLabel,
      metric
    })
  );

  const uniqueMetricsLabels = getUniqueMetricsLabels(uniqueMetrics);

  const uniqueMetricsWithLabels = uniqueMetrics.map((item, index) => ({
    ...item,
    label: uniqueMetricsLabels[index] || ''
  }));

  return uniqueMetricsWithLabels;
}
