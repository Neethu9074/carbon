/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo, useState } from 'react';

import { Card, Link, Spacer, Typography } from '@instana/components';

// @ts-expect-error
import GroupedInfrastructure, { toBackendGroupBy } from 'in-infrastructure/Explore/components/GroupedInfrastructure';
import { MetricItem, useLinkToExplore as useLinkToInfraEntityExplore } from 'in-infrastructure/navigation/paths';
// @ts-expect-error
import InfrastructureList from 'in-infrastructure/Explore/components/InfrastructureList';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
// @ts-expect-error
import { defaultOrder } from 'in-infrastructure/Explore/constants';
import { Group, MetricCatalog, TagFilterExpressionElementUnion } from 'in-types';
import { TableWidgetProps } from 'in-custom-dashboards/widgets/Table/types';
import useMetricMetadatas from 'in-infrastructure/hooks/useMetricMetadatas';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { KpiDefinition } from 'in-sdk/metrics/kpis';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { Trans, t } from 'in-i18n';

import locals from 'in-custom-dashboards/widgets/Table/infrastructure/InfrastructureTableWidget.mless';

export function InfrastructureTableWidget(props: TableWidgetProps) {
  const { config, title, actions, dragHandle, isPreview } = props;

  const getLinkToInfraEntityExplore = useLinkToInfraEntityExplore();
  const timeConfig = useTimeConfig();
  const { goToPath } = useNavigation();
  const { entityType: type = '', tableSize = 5, tagFilterExpression, grouping: groupBy } = config;

  const kpiDefinitions = [] as KpiDefinition[];
  const metrics = [] as MetricItem[];
  const metricMetadatas = useMetricMetadatas({ type, kpiDefinitions });
  const [order, setOrder] = useState(defaultOrder);
  const [totalItemsCount, setTotalItemsCount] = useState();

  const backendGroupBy = useMemo(() => toBackendGroupBy(groupBy), [groupBy]);
  const metricCatalog = [] as MetricCatalog;

  const loadedItemsCount = totalItemsCount && Math.min(totalItemsCount, tableSize);
  const isShowResultsVisible = loadedItemsCount && totalItemsCount;
  const isGroup = groupBy && groupBy?.length > 0;

  const onItemClicked = (href: string) => {
    if (isPreview) {
      return;
    }

    goToPath(href);
  };

  const viewFullTableHref = getLinkToInfraEntityExplore({
    type,
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
          onItemClicked={onItemClicked}
          metricCatalog={metricCatalog}
          metrics={metrics}
          metricMetadatas={metricMetadatas}
          retrievalSize={tableSize}
          order={order}
          setOrder={setOrder}
          tagFilterExpression={[]}
          timeConfig={timeConfig}
          type={type}
        />
      ) : (
        <InfrastructureList
          backendQueryModel={tagFilterExpression}
          displayChart={false}
          getTotalItems={setTotalItemsCount}
          isLoadMoreEnabled={false}
          isPreview={isPreview}
          metrics={metrics}
          metricMetadatas={metricMetadatas}
          numSkeletonRows={tableSize}
          order={order}
          retrievalSize={tableSize}
          setOrder={setOrder}
          showHeader={false}
          tagFilterExpression={tagFilterExpression}
          timeConfig={timeConfig}
          type={type}
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
