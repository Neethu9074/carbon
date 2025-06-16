/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { PaginatedResult } from '@instana/types';

import { GetAllSloConfigurationsArguments } from 'in-service-levels/api/sloConfiguration';
import useSloConfigurations from 'in-service-levels/hooks/useSloConfigurations';
import useSloEntitiesLabels from 'in-service-levels/hooks/useSloEntitiesLabels';
import { all as allProgress } from 'in-hooks/utils/progress';
import { SelectSloListItem } from 'in-service-levels/types';
import { FetchedState } from 'in-hooks/utils/types';

export default function useSloListItems({
  page,
  pageSize,
  orderBy,
  orderDirection,
  query,
  entityType
}: GetAllSloConfigurationsArguments): FetchedState<PaginatedResult<SelectSloListItem>> {
  const [configurations, , configurationErrors, configurationProgress] = useSloConfigurations({
    page,
    pageSize,
    orderBy,
    orderDirection,
    query,
    entityType
  });
  const [labels, , labelsErrors, labelsProgress] = useSloEntitiesLabels(configurations?.items ?? []);
  const progress = allProgress(configurationProgress, labelsProgress);
  const errors = [...configurationErrors, ...labelsErrors];

  return [
    {
      ...configurations!,
      items: (configurations?.items ?? []).map(configuration => ({
        configuration,
        entities: labels?.[configuration.id!] ?? [{ id: '', label: '' }]
      }))
    },
    'resolved',
    errors,
    progress
  ];
}
