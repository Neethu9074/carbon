/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { OrderDirection, SliConfigurationWithLastUpdated } from '@instana/types';

import useSliConfigurations from 'in-custom-dashboards/widgets/SloLegacy/hooks/useSliConfigurations';
import { SliType } from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes';
import { compare, containsIgnoreCase } from 'in-services/util/string';
import { FetchedState } from 'in-hooks/utils/types';

export default function useFilteredAndSortedSliConfigurations(
  entityType: SliType,
  entityId: string,
  query: string = '',
  orderBy: string = 'name',
  orderDirection: OrderDirection = 'ASC'
): FetchedState<SliConfigurationWithLastUpdated[]> {
  const fetchedConfigState = useSliConfigurations(entityType, entityId);

  const [data, status, errors, progress] = fetchedConfigState;

  if (!data || status !== 'resolved') {
    return fetchedConfigState;
  }

  const resultData = data
    .filter(config => containsIgnoreCase(config.sliName, query))
    .sort((a, b) => {
      if (orderBy === 'name') {
        return compareSliConfigByName(a, b) * (orderDirection === 'ASC' ? 1 : -1);
      }
      return 0;
    });

  return [resultData, status, errors, progress];
}

function compareSliConfigByName(a: SliConfigurationWithLastUpdated, b: SliConfigurationWithLastUpdated): number {
  return compare(a.sliName, b.sliName);
}
