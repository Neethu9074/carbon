/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useObservable } from '@instana/hooks';

import { isLoading, hasError, mapData, error } from 'in-services/util/result';
import { Subtrace } from 'in-applications/lists/SubtracesList';
import { getSubtraces } from 'in-applications/api/subtraces';
import { pendingResult } from 'in-services/fixedObjects';
import { Result } from 'in-types';

export const useSubtrace = (subtraceId: string) => {
  // TODO: replace with call to single subtrace API when BE is ready
  const result = useObservable(getSubtraces, [subtraceId]) ?? (pendingResult as Result<Subtrace[]>);

  if (isLoading(result)) return pendingResult as Result<Subtrace>;
  if (hasError(result)) return error<Subtrace>(result.errors);

  const subtrace = mapData(result, traces => traces.find(trace => trace.id === subtraceId));
  return subtrace;
};
