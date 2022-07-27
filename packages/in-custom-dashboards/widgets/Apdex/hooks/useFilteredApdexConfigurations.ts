/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';

import useApdexConfigurations from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexConfigurations';
import { ApdexEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import { containsIgnoreCase } from 'in-services/util/string';
import { FetchedState } from 'in-hooks/utils/types';
import { ApdexConfiguration } from 'in-types';

export default function useFilteredApdexConfigurations(
  entityType: ApdexEntityTypes,
  entityId: string,
  initialNameQuery = ''
): [FetchedState<ApdexConfiguration[]>, React.Dispatch<React.SetStateAction<string>>] {
  const [query, setQuery] = useState(initialNameQuery);

  const fetchedConfigState = useApdexConfigurations(entityType, entityId);
  const [data, status, errors, progress] = fetchedConfigState;

  if (!data || !query || status !== 'resolved') return [fetchedConfigState, setQuery];

  const filteredState: FetchedState<ApdexConfiguration[]> = [
    data.filter(apdexConfig => containsIgnoreCase(apdexConfig.apdexName, query)),
    status,
    errors,
    progress
  ];

  return [filteredState, setQuery];
}
