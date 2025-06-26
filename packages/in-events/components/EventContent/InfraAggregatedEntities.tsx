/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { noop } from 'lodash';
import React from 'react';

import { CarbonAccordion, CarbonAccordionItem, Link, LoadingSkeleton, Message, Stack } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  AggregationType,
  ApiTag,
  Cursor,
  Cursorific,
  EntityHealthInfo,
  Error,
  GenericInfraAlertRule,
  Order,
  Progress,
  Result,
  RuleWithThreshold,
  TagFilterExpressionElementUnion,
  TimeConfig
} from 'in-types';
import { SeverityIndicatorCellContentWrapper } from 'in-components/tables/ServerTable/internalComponents/LegacySeverityIndicatorCellContentWrapper';
// @ts-expect-error no typedef available
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import { getMetrics } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
//@ts-expect-error
import { getMetricsColumn } from 'in-infrastructure/Explore/components/GroupedInfrastructure';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter/HealthIndicatorPresenter';
//@ts-expect-error
import CursorPaginatedTable from 'in-components/tables/ServerTable/CursorPaginatedTable';
import useMetricMetadatas, { Metadatas } from 'in-infrastructure/hooks/useMetricMetadatas';
import { getEntitiesData } from 'in-events/components/util/getEntitiesForAggregatedEntity';
import { getGranularity, getMetricKey } from 'in-infrastructure/Explore/services/metrics';
import { isGreaterOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { useLinkToNavigate } from 'in-events/components/AnalyzeInfraEventButton';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import EntityLink, { SnapshotMap } from 'in-components/EntityLink/EntityLink';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { parseUrl } from 'in-stores/navigation/routing/parser';
import { getSnapshot } from 'in-stores/snapshot/snapshot';
import { getKpiDefinitions } from 'in-sdk/metrics/kpis';
import { t } from 'in-i18n';

import locals from 'in-events/components/EventContent/InfraEventContent.mless';

const retrievalSize = 5;
interface AggregatedEntitiesProps {
  tagFilterFormModel: FormModelElement[];
  timeConfig: TimeConfig;
  ruleWithThreshold: RuleWithThreshold<GenericInfraAlertRule>;
  tagFilterExpression: TagFilterExpressionElementUnion;
  groupedTagFilterExpression: TagFilterExpressionElementUnion;
  groupingTags: Record<string, string>;
  tagsFromTagCatalog: ApiTag[] | undefined;
  metricLabel: string;
  aggregatedEntitiesOpen: boolean;
  setAggregatedEntitiesOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
interface EntityItem {
  snapshotId: string;
  label: string;
  plugin: string;
  time: number;
  metrics: Record<string, [number, number][]>;
  entityHealthInfo: EntityHealthInfo;
}
export function InfraAggregatedEntitiesTablePresenter({
  tagFilterFormModel,
  timeConfig,
  ruleWithThreshold,
  tagFilterExpression,
  groupedTagFilterExpression: groupedTagFilterExpression,
  groupingTags,
  tagsFromTagCatalog,
  metricLabel,
  aggregatedEntitiesOpen,
  setAggregatedEntitiesOpen
}: Omit<AggregatedEntitiesProps, 'timeConfig'> & {
  timeConfig: TimeConfig | undefined;
}) {
  if (!timeConfig) {
    return (
      <Message type="error" small withIcon fullInlineWidth>
        {t('in-events:infraSmartAlerts.aggregatedEntityEvent.invalidTimeConfigError')}
      </Message>
    );
  }

  return (
    <InfraAggregatedEntities
      tagFilterFormModel={tagFilterFormModel}
      timeConfig={timeConfig}
      ruleWithThreshold={ruleWithThreshold}
      tagFilterExpression={tagFilterExpression}
      groupedTagFilterExpression={groupedTagFilterExpression}
      groupingTags={groupingTags}
      tagsFromTagCatalog={tagsFromTagCatalog}
      metricLabel={metricLabel}
      aggregatedEntitiesOpen={aggregatedEntitiesOpen}
      setAggregatedEntitiesOpen={setAggregatedEntitiesOpen}
    />
  );
}

const InfraAggregatedEntities = ({
  tagFilterFormModel,
  timeConfig,
  ruleWithThreshold,
  tagFilterExpression,
  groupedTagFilterExpression: groupedTagFilterExpression,
  groupingTags,
  tagsFromTagCatalog,
  metricLabel,
  aggregatedEntitiesOpen,
  setAggregatedEntitiesOpen
}: AggregatedEntitiesProps) => {
  const { rule, thresholdOperator } = ruleWithThreshold;

  const { metricName, entityType, aggregation, crossSeriesAggregation, regex } = rule || {};

  const metrics = getMetrics(metricName, aggregation, crossSeriesAggregation, regex, metricLabel);
  const kpiDefinitions = getKpiDefinitions(entityType);
  const metricMetadatas = useMetricMetadatas({ type: entityType, queries: [metrics[0].metric], kpiDefinitions });
  const id = getMetricKey(metricName, aggregation, crossSeriesAggregation);
  const order: Order = { by: id, direction: isGreaterOperator(thresholdOperator) ? 'DESC' : 'ASC' };
  const adjustedGranularityForChart: number = getGranularity(timeConfig);

  const result = useCursorPagination(
    () =>
      getEntitiesData({
        timeConfig,
        granularity: adjustedGranularityForChart,
        backendQueryModel: tagFilterFormModel,
        metric: metricName,
        retrievalSize,
        id,
        aggregation,
        crossSeriesAggregation,
        order,
        type: entityType,
        tagFilterExpression: groupedTagFilterExpression,
        regex
      }),
    []
  );

  if (result.progress.loading) {
    return <LoadingSkeleton className={locals.aggregatedEntityListSkeleton} />;
  }

  if (result.items.length === 0 && result.errors.length > 0) {
    return (
      <Message type="error" small withIcon fullInlineWidth>
        {result.errors[0].message}
      </Message>
    );
  }

  return (
    <CarbonAccordion className={locals.aggregatedEntitiesAccordian}>
      <CarbonAccordionItem
        open={aggregatedEntitiesOpen}
        title={t('in-events:infraSmartAlerts.aggregatedEntityEvent.titleAggregatedEntityList', {
          totalEntityCount: result.totalHits
        })}
        onHeadingClick={({ isOpen }) => setAggregatedEntitiesOpen(isOpen)}
      >
        <AggregatedEntitiesTable
          items={result.items}
          timeConfig={timeConfig}
          metricMetadatas={metricMetadatas}
          metricName={metricName}
          totalHits={result.totalHits}
          progress={result.progress}
          canLoadMore={result.totalHits !== undefined && result.totalHits > retrievalSize}
          label={metricLabel}
          aggregation={aggregation}
          crossSeriesAggregation={crossSeriesAggregation}
          rule={rule}
          tagFilterExpression={tagFilterExpression}
          groupingTags={groupingTags}
          tagsFromTagCatalog={tagsFromTagCatalog}
          granularity={adjustedGranularityForChart}
          errors={result.errors}
          order={order}
        />
      </CarbonAccordionItem>
    </CarbonAccordion>
  );
};

interface AggregatedEntitiesTableProps {
  items: Cursorific<Cursor>[];
  timeConfig: TimeConfig;
  metricMetadatas: Result<Metadatas>;
  metricName: string;
  totalHits?: number;
  progress: Progress;
  canLoadMore: boolean;
  label: string;
  aggregation: AggregationType;
  crossSeriesAggregation: AggregationType;
  rule: GenericInfraAlertRule;
  tagFilterExpression: TagFilterExpressionElementUnion;
  groupingTags: Record<string, string>;
  tagsFromTagCatalog: ApiTag[] | undefined;
  granularity: number;
  errors: Error[];
  order: Order;
}

const AggregatedEntitiesTable: React.FC<AggregatedEntitiesTableProps> = ({
  items,
  timeConfig,
  metricMetadatas,
  metricName,
  totalHits,
  progress,
  canLoadMore,
  label,
  aggregation,
  crossSeriesAggregation,
  rule,
  tagFilterExpression,
  groupingTags,
  tagsFromTagCatalog,
  granularity,
  errors,
  order
}) => {
  const { navigate } = useNavigation();

  const columnDefinitions = getColumnDefinitions(
    timeConfig,
    granularity,
    metricMetadatas,
    metricName,
    aggregation,
    crossSeriesAggregation,
    label
  );

  const getLinkToUA = useLinkToNavigate(tagFilterExpression, rule, timeConfig, groupingTags, tagsFromTagCatalog, order);
  return (
    <>
      <CursorPaginatedTable
        columnDefinitions={columnDefinitions}
        numSkeletonRows={3}
        totalHits={totalHits}
        progress={progress}
        items={items}
        isSearchable={false}
        defaultPageSize={5}
        onRowClick={noop}
        size="compact"
        errors={errors}
      />
      {canLoadMore && (
        <Stack align="center">
          <Link
            href="#"
            onClick={e => {
              e.preventDefault();
              navigate(parseUrl(getLinkToUA(), true));
            }}
          >
            {t('in-events:infraSmartAlerts.aggregatedEntityEvent.viewAllEntitiesInScope', { count: totalHits })}
          </Link>
        </Stack>
      )}
    </>
  );
};

function getColumnDefinitions(
  timeConfig: TimeConfig,
  granularity: number,
  metricMetadatas: Result<Metadatas>,
  metric: string,
  aggregation: AggregationType,
  crossSeriesAggregation: AggregationType,
  label: string
) {
  const nameColumn = {
    id: 'label',
    label: t('in-infrastructure:explore.name'),
    sortable: false,
    getContent(item: EntityItem) {
      return <NameColumnPresenter item={item} timeConfig={timeConfig} />;
    }
  };

  const metricsColumnWithoutSorting = getMetricsColumn({
    metrics: [{ metric, aggregation, crossSeriesAggregation, regex: false, label: label }],
    metricMetadatas,
    timeConfig,
    granularity,
    isTableMode: true
  }).map((metricColumn: object) => {
    return {
      ...metricColumn,
      sortable: false
    };
  });

  const healthColumn = {
    id: 'Health',
    label: t('in-infrastructure:explore.health'),
    sortable: false,
    getContent(item: EntityItem) {
      return (
        <EntityHealthIndicator
          openIssues={item.entityHealthInfo?.openIssues?.length ?? 0}
          maxSeverity={item.entityHealthInfo?.maxSeverity ?? 0}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={timeConfig}
          snapshotId={item.snapshotId}
          inContentArea
        />
      );
    }
  };

  return [nameColumn, ...metricsColumnWithoutSorting, healthColumn];
}

interface NameColumnPresenterProps {
  item: EntityItem;
  timeConfig: TimeConfig;
}

const NameColumnPresenter: React.FC<NameColumnPresenterProps> = ({ item, timeConfig }) => {
  const getDashboardLink = useGetDashboardLink();
  const snapshot = useObservable(
    () => getSnapshot(item.snapshotId).map(snapshot => (snapshot as SnapshotMap) ?? undefined),
    [item.snapshotId]
  );

  const timeForEntityDashboard = timeConfig
    ? timeConfig.to && timeConfig.to > item.time
      ? item.time
      : timeConfig.to
    : undefined;

  return (
    <SeverityIndicatorCellContentWrapper severity={item.entityHealthInfo?.maxSeverity}>
      <EntityLink
        label={item.label}
        plugin={item.plugin}
        snapshot={snapshot ?? undefined}
        href={getDashboardLink(item.snapshotId, {
          pathname: physicalDashboardPath,
          to: timeForEntityDashboard ?? undefined,
          focusedMoment: timeForEntityDashboard ?? undefined,
          windowSize: timeConfig.windowSize
        })}
      />
    </SeverityIndicatorCellContentWrapper>
  );
};
