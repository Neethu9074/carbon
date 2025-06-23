/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { PaginatedResult, Result, ServiceLevelObjectiveConfiguration, TimeConfig } from '@instana/types';

import useSloListMetrics, { SloMetricsResultMap } from 'in-service-levels/hooks/useSloListMetrics';
import { calculateSloGranularity, applyAdjustedTimeframe } from 'in-service-levels/utils/time';
import { GetAllSloConfigurationsArguments } from 'in-service-levels/api/sloConfiguration';
import useSloConfigurations from 'in-service-levels/hooks/useSloConfigurations';
import useSloEntitiesLabels from 'in-service-levels/hooks/useSloEntitiesLabels';
import { getSingleNumberMetricValue } from 'in-service-levels/utils/format';
import { LabeledEntity, SloListItem } from 'in-service-levels/types';
import { all as allProgress } from 'in-hooks/utils/progress';
import { MetricDataSeries } from 'in-components/Chart/types';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function useSloListItems({
  page,
  pageSize,
  query,
  tags,
  entityType,
  entityIds,
  orderBy,
  orderDirection,
  sloStatus,
  blueprint
}: GetAllSloConfigurationsArguments): Result<PaginatedResult<SloListItem>> {
  const timeConfig = useTimeConfig();
  const [configurationPage, , configurationErrors, configurationProgress] = useSloConfigurations({
    page,
    pageSize,
    query,
    tags,
    entityType,
    sloStatus,
    entityIds,
    orderBy,
    orderDirection,
    blueprint
  });
  const configurations = configurationPage?.items ?? [];

  const [labels, , labelsErrors, labelsProgress] = useSloEntitiesLabels(configurations);
  const [metrics] = useSloListMetrics(configurations);
  const progress = allProgress(configurationProgress, labelsProgress);
  const errors = [...configurationErrors, ...labelsErrors];

  return {
    errors,
    progress,
    data: {
      ...configurationPage!,
      items: configurations.map(configuration => buildSloListItem({ configuration, labels, metrics, timeConfig }))
    }
  };
}

export function buildSloListItem({
  configuration,
  labels,
  metrics,
  timeConfig: tc
}: {
  configuration: ServiceLevelObjectiveConfiguration;
  labels?: Record<string, LabeledEntity[]>;
  metrics?: Record<string, SloMetricsResultMap>;
  timeConfig: TimeConfig;
}): SloListItem {
  const {
    remainingBudgetSpark,
    status: statusMetrics,
    remainingBudget: remainingBudgetMetrics
  } = metrics?.[configuration.id!]?.[configuration.id!] ?? {};
  const timeConfig = applyAdjustedTimeframe(tc, remainingBudgetSpark?.adjustedTimeframe);
  const granularity = remainingBudgetSpark?.granularity ?? calculateSloGranularity(timeConfig);
  const status = getSingleNumberMetricValue(statusMetrics);
  const remainingBudget = getSingleNumberMetricValue(remainingBudgetMetrics);

  return {
    configuration,
    entities: labels?.[configuration.id!] ?? [{ id: '', label: '' }],
    status,
    remainingBudget,
    burnDown: (remainingBudgetSpark?.values ?? []) as MetricDataSeries,
    metricTimeConfig: timeConfig,
    metricGranularity: granularity
  };
}
