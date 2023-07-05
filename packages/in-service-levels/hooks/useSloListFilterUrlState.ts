/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useMemo } from 'react';

import { SloEntityType } from '@instana/types';

import { createEntityIdUrlParameter, createTagsUrlParameter } from 'in-service-levels/navigation/urlParameters';
import useUrlState, { Options, UrlStateReturn } from 'in-hooks/useUrlState';

interface SloListFilterState {
  tags: string[];
  entityType?: SloEntityType;
}

interface Params {
  pathSegment: string;
  matrixPrefix?: string;
}

export default function useSloListFilterUrlState({
  pathSegment,
  matrixPrefix
}: Params): UrlStateReturn<SloListFilterState> {
  const urlStateDefinition = useMemo(
    () => createUrlStateDefinition({ pathSegment, matrixPrefix }),
    [pathSegment, matrixPrefix]
  );
  return useUrlState(urlStateDefinition);
}

function createUrlStateDefinition({ pathSegment, matrixPrefix = '' }: Params): Options<SloListFilterState> {
  return {
    bind: [createEntityIdUrlParameter(pathSegment, matrixPrefix), createTagsUrlParameter(pathSegment, matrixPrefix)]
  };
}
