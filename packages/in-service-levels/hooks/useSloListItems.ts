/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { PaginatedResult, ServiceLevelObjectiveConfiguration, TimeConfig } from '@instana/types';

import { GetAllSloConfigurationsArguments } from 'in-service-levels/api/configuration';
import useSloConfigurations from 'in-service-levels/hooks/useSloConfigurations';
import useSloEntitiesLabels from 'in-service-levels/hooks/useSloEntitiesLabels';
import { SloListItem } from 'in-service-levels/components/SloList/SloList';
import { calculateSloGranularity } from 'in-service-levels/utils';
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

  const [labels, labelsStatus, labelsErrors, labelsProgress] = useSloEntitiesLabels(configurationPage?.items ?? []);

  const status = allStatus(configurationStatus, labelsStatus);
  const progress = allProgress(configurationProgress, labelsProgress);
  const errors = [...configurationErrors, ...labelsErrors];

  if (status != 'resolved') {
    return [undefined, status, errors, progress];
  }
  return [
    {
      ...configurationPage!,
      items:
        configurationPage!.items.map(configuration => buildSloListItem({ configuration, labels, timeConfig })) ?? []
    },
    status,
    errors,
    progress
  ];
}

function buildSloListItem({
  configuration,
  labels,
  timeConfig
}: {
  configuration: ServiceLevelObjectiveConfiguration;
  labels?: Record<string, LabeledEntity>;
  timeConfig: TimeConfig;
}): SloListItem {
  const metricTimeConfig = {
    ...timeConfig,
    to: timeConfig.to ?? Date.now()
  };
  const granularity = calculateSloGranularity(metricTimeConfig);
  const metrics = generateFakeBurndown(metricTimeConfig, granularity);
  return {
    configuration,
    entity: labels?.[configuration.id!] ?? { label: '' },
    status: Math.random(),
    remainingBudget: metrics.at(-1)?.[1] ?? 0,
    burnDown: metrics,
    metricTimeConfig,
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
