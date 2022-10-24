/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { ApdexConfiguration, OrderDirection } from '@instana/types';

import useApdexConfigurations from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexConfigurations';
import { ApdexEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import { compare, containsIgnoreCase } from 'in-services/util/string';
import { FetchedState } from 'in-hooks/utils/types';

export default function useFilteredAndSortedApdexConfigurations(
  entityType: ApdexEntityTypes,
  entityId: string,
  query: string = '',
  orderBy: string = 'name',
  orderDirection: OrderDirection = 'ASC'
): FetchedState<ApdexConfiguration[]> {
  const fetchedConfigState = useApdexConfigurations(entityType, entityId);
  const [data, status, errors, progress] = fetchedConfigState;

  if (!data || status !== 'resolved') return fetchedConfigState;

  const resultData = data
    .filter(apdexConfig => containsIgnoreCase(apdexConfig.apdexName, query))
    .sort((a, b) => {
      if (orderBy === 'name') {
        return compareApdexConfigByName(a, b) * (orderDirection === 'ASC' ? 1 : -1);
      }
      return 0;
    });

  const filteredState: FetchedState<ApdexConfiguration[]> = [resultData, status, errors, progress];

  return filteredState;
}

function compareApdexConfigByName(a: ApdexConfiguration, b: ApdexConfiguration): number {
  return compare(a.apdexName, b.apdexName);
}
