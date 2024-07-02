/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useMemo } from 'react';

import {
  createTypeUrlParameter,
  createTagsUrlParameter,
  createTabTypeUrlParameter
} from 'in-automation/navigation/urlParameters';
import useUrlState, { Options, UrlStateReturn } from 'in-hooks/useUrlState';

export interface ActionCatalogFilterState {
  tags: string[];
  types?: string[];
  view?: string;
}

interface Params {
  pathSegment: string;
  matrixPrefix?: string;
}

export default function useActionCatalogFilterUrlState({
  pathSegment,
  matrixPrefix
}: Params): UrlStateReturn<ActionCatalogFilterState> {
  const urlStateDefinition = useMemo(
    () => createUrlStateDefinition({ pathSegment, matrixPrefix }),
    [pathSegment, matrixPrefix]
  );
  return useUrlState(urlStateDefinition);
}

function createUrlStateDefinition({ pathSegment, matrixPrefix = '' }: Params): Options<ActionCatalogFilterState> {
  return {
    bind: [
      createTypeUrlParameter(pathSegment, matrixPrefix),
      createTagsUrlParameter(pathSegment, matrixPrefix),
      createTabTypeUrlParameter(pathSegment, matrixPrefix)
    ]
  };
}
