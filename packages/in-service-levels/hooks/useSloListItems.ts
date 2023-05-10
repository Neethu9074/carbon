/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { PaginatedResult, ServiceLevelObjectiveConfiguration, TimeConfig } from '@instana/types';

import useSloListMetrics, { SloMetricsResult } from 'in-service-levels/hooks/useSloListMetrics';
import { calculateSloGranularity, getSingleNumberMetricValue } from 'in-service-levels/utils';
import { GetAllSloConfigurationsArguments } from 'in-service-levels/api/configuration';
import useSloConfigurations from 'in-service-levels/hooks/useSloConfigurations';
import useSloEntitiesLabels from 'in-service-levels/hooks/useSloEntitiesLabels';
import { SloListItem } from 'in-service-levels/components/SloList/SloList';
import { all as allStatus } from 'in-hooks/utils/fetchStatus';
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
  const [configurationPage, configurationStatus, configurationErrors, configurationProgress] = useSloConfigurations({
    page,
    pageSize,
    query,
    tags,
    entityType,
    orderBy,
    orderDirection
  });
  const configurations = configurationPage?.items ?? [];

  const [labels, labelsStatus, labelsErrors, labelsProgress] = useSloEntitiesLabels(configurations);
  const [metrics, metricStatus, metricErrors, metricProgress] = useSloListMetrics(configurations, timeConfig);

  const status = allStatus(configurationStatus, labelsStatus, metricStatus);
  const progress = allProgress(configurationProgress, labelsProgress, metricProgress);
  const errors = [...configurationErrors, ...labelsErrors, ...metricErrors];

  if (status != 'resolved') {
    return [undefined, status, errors, progress];
  }
  return [
    {
      ...configurationPage!,
      items:
        configurationPage!.items.map(configuration =>
          buildSloListItem({ configuration, labels, metrics, timeConfig })
        ) ?? []
    },
    status,
    errors,
    progress
  ];
}

function buildSloListItem({
  configuration,
  labels,
  metrics,
  timeConfig
}: {
  configuration: ServiceLevelObjectiveConfiguration;
  labels?: Record<string, LabeledEntity>;
  metrics?: Record<string, SloMetricsResult>;
  timeConfig: TimeConfig;
}): SloListItem {
  // TODO: to be replaced by the actual timeConfig returned from the remaining error budget metric
  const metricTimeConfig = {
    ...timeConfig,
    to: timeConfig.to ?? Date.now()
  };
  const granularity = calculateSloGranularity(metricTimeConfig);
  // TODO: to be replaced by a time series metric for the remaining error budget of the slo
  const mockMetrics = generateFakeBurndown(metricTimeConfig, granularity);
  const status = getSingleNumberMetricValue(metrics?.[configuration.id!]?.status) ?? 0;

  return {
    configuration,
    entity: labels?.[configuration.id!] ?? { label: '' },
    status,
    remainingBudget: mockMetrics.at(-1)?.[1] ?? 0,
    burnDown: mockMetrics,
    metricTimeConfig,
    // TODO: to be replaced by the actual granularity returned from the remaining error budget metric
    metricGranularity: granularity
  };
}

/**
 * Generates mock data for the slo status. This will be replaced one the slo metrics are available via getUnifiedMetrics
 */
function generateFakeBurndown(timeConfig: TimeConfig, granularity: number): MetricDataSeries {
  const dataSeries: MetricDataSeries = [];
  const to = timeConfig.to!;
  const from = to - timeConfig.windowSize;

  for (let timeStamp = from; timeStamp <= to; timeStamp += granularity) {
    dataSeries.push([timeStamp, Math.round(Math.random() * 5000)]);
  }

  return dataSeries;
}
