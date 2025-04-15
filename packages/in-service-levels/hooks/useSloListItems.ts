/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { PaginatedResult, ServiceLevelObjectiveConfiguration, TimeConfig } from '@instana/types';

import useSloListMetrics, { SloMetricsResultMap } from 'in-service-levels/hooks/useSloListMetrics';
import { calculateSloGranularity, applyAdjustedTimeframe } from 'in-service-levels/utils/time';
import { GetAllSloConfigurationsArguments } from 'in-service-levels/api/configuration';
import useSloConfigurations from 'in-service-levels/hooks/useSloConfigurations';
import useSloEntitiesLabels from 'in-service-levels/hooks/useSloEntitiesLabels';
import { getSingleNumberMetricValue } from 'in-service-levels/utils/format';
import { SloListItem } from 'in-service-levels/components/SloList/SloList';
import { all as allProgress } from 'in-hooks/utils/progress';
import { MetricDataSeries } from 'in-components/Chart/types';
import { LabeledEntity } from 'in-service-levels/types';
import { FetchedState } from 'in-hooks/utils/types';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function useSloListItems({
  page,
  pageSize,
  query,
  tags,
  entityType,
  entityIds,
  orderBy,
  orderDirection
}: GetAllSloConfigurationsArguments): FetchedState<PaginatedResult<SloListItem>> {
  const timeConfig = useTimeConfig();
  const [configurationPage, , configurationErrors, configurationProgress] = useSloConfigurations({
    page,
    pageSize,
    query,
    tags,
    entityType,
    entityIds,
    orderBy,
    orderDirection
  });
  const configurations = configurationPage?.items ?? [];

  const [labels, , labelsErrors, labelsProgress] = useSloEntitiesLabels(configurations);
  const [metrics, , , metricProgress] = useSloListMetrics(configurations, timeConfig);
  const progress = allProgress(configurationProgress, labelsProgress, metricProgress);
  const errors = [...configurationErrors, ...labelsErrors];

  return [
    {
      ...configurationPage!,
      items: configurations.map(configuration => buildSloListItem({ configuration, labels, metrics, timeConfig }))
    },
    'resolved',
    errors,
    progress
  ];
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
