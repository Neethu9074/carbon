/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import type { PaginatedResult, Result, ServiceLevelObjectiveConfiguration, TimeConfig } from '@instana/types';

import type { GetAllSloConfigurationsArguments } from 'in-service-levels/api/sloConfiguration';
import useSloConfigurations from 'in-service-levels/hooks/useSloConfigurations';
import useSloEntitiesLabels from 'in-service-levels/hooks/useSloEntitiesLabels';
import type { LabeledEntity, SloListItem } from 'in-service-levels/types';
import { all as allProgress } from 'in-hooks/utils/progress';
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
  const progress = allProgress(configurationProgress, labelsProgress);
  const errors = [...configurationErrors, ...labelsErrors];

  return {
    errors,
    progress,
    data: {
      ...configurationPage!,
      items: configurations.map(configuration => buildSloListItem({ configuration, labels, timeConfig }))
    }
  };
}

export function buildSloListItem({
  configuration,
  labels
}: {
  configuration: ServiceLevelObjectiveConfiguration;
  labels?: Record<string, LabeledEntity[]>;
  timeConfig: TimeConfig;
}): SloListItem {
  return {
    configuration,
    entities: labels?.[configuration.id!] ?? [{ id: '', label: '' }]
  };
}
