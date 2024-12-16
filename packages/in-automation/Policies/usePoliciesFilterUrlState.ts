/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useMemo } from 'react';

import { TypeConfigurationType } from '@instana/types';

import { createTagsUrlParameter, createPolicyTypeUrlParameter } from 'in-automation/navigation/urlParameters';
import useUrlState, { Options, UrlStateReturn } from 'in-hooks/useUrlState';

export interface PoliciesFilterState {
  tags: string[];
  type?: TypeConfigurationType;
}

interface Params {
  pathSegment: string;
  matrixPrefix?: string;
}

export default function usePoliciesFilterUrlState({
  pathSegment,
  matrixPrefix
}: Params): UrlStateReturn<PoliciesFilterState> {
  const urlStateDefinition = useMemo(
    () => createUrlStateDefinition({ pathSegment, matrixPrefix }),
    [pathSegment, matrixPrefix]
  );
  return useUrlState(urlStateDefinition);
}

function createUrlStateDefinition({ pathSegment, matrixPrefix = '' }: Params): Options<PoliciesFilterState> {
  return {
    bind: [createPolicyTypeUrlParameter(pathSegment, matrixPrefix), createTagsUrlParameter(pathSegment, matrixPrefix)]
  };
}
