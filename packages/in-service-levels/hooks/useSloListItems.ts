/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { PaginatedResult, ServiceLevelObjectiveConfiguration, TimeConfig } from '@instana/types';

import useSloListMetrics, { SloMetricsResult } from 'in-service-levels/hooks/useSloListMetrics';
import { GetAllSloConfigurationsArguments } from 'in-service-levels/api/configuration';
import useSloConfigurations from 'in-service-levels/hooks/useSloConfigurations';
import useSloEntitiesLabels from 'in-service-levels/hooks/useSloEntitiesLabels';
import { getSingleNumberMetricValue } from 'in-service-levels/utils/format';
import { SloListItem } from 'in-service-levels/components/SloList/SloList';
import { calculateSloGranularity } from 'in-service-levels/utils/time';
import { applyAdjustedTimeframe } from 'in-service-levels/utils/time';
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
    orderBy,
    orderDirection
  });
  const configurations = configurationPage?.items ?? [];

  const [labels, , labelsErrors, labelsProgress] = useSloEntitiesLabels(configurations);
  const [metrics, , metricErrors, metricProgress] = useSloListMetrics(configurations, timeConfig);

  const progress = allProgress(configurationProgress, labelsProgress, metricProgress);
  const errors = [...configurationErrors, ...labelsErrors, ...metricErrors];

  return [
    {
      ...configurationPage!,
      items: configurations.map(configuration => buildSloListItem({ configuration, labels, metrics, timeConfig })) ?? []
    },
    'resolved',
    errors,
    progress
  ];
}

function buildSloListItem({
  configuration,
  labels,
  metrics,
  timeConfig: tc
}: {
  configuration: ServiceLevelObjectiveConfiguration;
  labels?: Record<string, LabeledEntity>;
  metrics?: Record<string, SloMetricsResult>;
  timeConfig: TimeConfig;
}): SloListItem {
  const { remainingBudgetSpark } = metrics?.[configuration.id!] ?? {};
  const timeConfig = applyAdjustedTimeframe(tc, remainingBudgetSpark?.adjustedTimeframe);
  const granularity = remainingBudgetSpark?.granularity ?? calculateSloGranularity(timeConfig);
  const status = getSingleNumberMetricValue(metrics?.[configuration.id!]?.status);
  const remainingBudget = getSingleNumberMetricValue(metrics?.[configuration.id!]?.remainingBudget);

  return {
    configuration,
    entity: labels?.[configuration.id!] ?? { label: '' },
    status,
    remainingBudget,
    burnDown: (remainingBudgetSpark?.values ?? []) as MetricDataSeries,
    metricTimeConfig: timeConfig,
    metricGranularity: granularity
  };
}
