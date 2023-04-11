/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useMemo } from 'react';

import { SloEntityType } from '@instana/types';

import { buildJsonParser, buildJsonSerializer } from 'in-stores/navigation/matrix';
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
    bind: [
      {
        path: pathSegment,
        name: `${matrixPrefix}entityType`,
        as: 'entityType'
      },
      {
        path: pathSegment,
        name: `${matrixPrefix}tags`,
        as: 'tags',
        initialState: [],
        parser: buildJsonParser([]),
        serializer: buildJsonSerializer()
      }
    ]
  };
}
