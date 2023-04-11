/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { PaginatedResult, ServiceLevelObjectiveConfiguration } from '@instana/types';

import { GetAllSloConfigurationsArguments } from 'in-service-levels/api/configuration';
import useSloConfigurations from 'in-service-levels/hooks/useSloConfigurations';
import useSloEntitiesLabels from 'in-service-levels/hooks/useSloEntitiesLabels';
import { SloListItem } from 'in-service-levels/components/SloList/SloList';
import { all as allStatus } from 'in-hooks/utils/fetchStatus';
import { all as allProgress } from 'in-hooks/utils/progress';
import { LabeledEntity } from 'in-service-levels/types';
import { FetchedState } from 'in-hooks/utils/types';

export default function useSloListItems({
  page,
  pageSize,
  query,
  tags,
  entityType,
  orderBy,
  orderDirection
}: GetAllSloConfigurationsArguments): FetchedState<PaginatedResult<SloListItem>> {
  const [configurationPage, configurationStatus, configrationErrors, configurationProgress] = useSloConfigurations({
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
  const errors = [...configrationErrors, ...labelsErrors];

  if (status != 'resolved') {
    return [undefined, status, errors, progress];
  }
  return [
    {
      ...configurationPage!,
      items: configurationPage!.items.map(configuration => buildSloListItem(configuration, labels)) ?? []
    },
    status,
    errors,
    progress
  ];
}

function buildSloListItem(
  configuration: ServiceLevelObjectiveConfiguration,
  labels?: Record<string, LabeledEntity>
): SloListItem {
  return {
    configuration,
    entity: labels?.[configuration.id!] ?? { label: '' },
    status: Math.random()
  };
}
