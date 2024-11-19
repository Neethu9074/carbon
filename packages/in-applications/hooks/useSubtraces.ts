/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useObservable } from '@instana/hooks';

import { error, hasError, isLoading, listSuccess } from 'in-services/util/result';
import { Subtrace } from 'in-applications/lists/SubtracesList';
import { getSubtraces } from 'in-applications/api/subtraces';
import { pendingResult } from 'in-services/fixedObjects';
import { PaginatedResult, Result } from 'in-types';

export const useSubtraces = (page: number, pageSize: number) => {
  const result = useObservable(getSubtraces, []) ?? pendingResult;

  if (isLoading(result)) return pendingResult as Result<PaginatedResult<Subtrace>>;
  if (hasError(result)) return error<PaginatedResult<Subtrace>>(result.errors);

  const subtraces = paginateResult(result.data!, page, pageSize);

  return subtraces;
};

function paginateResult(data: Subtrace[], page: number, pageSize: number) {
  const resultPage = data.slice((page - 1) * pageSize, page * pageSize);
  return listSuccess(resultPage, resultPage.length, pageSize, page);
}
