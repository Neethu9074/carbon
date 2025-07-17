/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import type { PaginatedResult, CorrectionConfiguration } from '@instana/types';
import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';

import type { GetAllCorrectionConfigurationsArguments } from 'in-service-levels/api/correctionConfiguration';
import { getAllCorrectionConfiguration } from 'in-service-levels/api/correctionConfiguration';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import type { FetchedState } from 'in-hooks/utils/types';

export default function useCorrectionConfigurations({
  ids,
  page,
  pageSize,
  orderDirection,
  query,
  sloId,
  orderBy
}: GetAllCorrectionConfigurationsArguments): FetchedState<PaginatedResult<CorrectionConfiguration>> {
  const result = useObservable(
    () =>
      getAllCorrectionConfiguration({
        ids,
        page,
        pageSize,
        orderDirection,
        query,
        sloId,
        orderBy
      }),
    [generateStableHash(ids), generateStableHash(sloId), page, pageSize, query, orderBy, orderDirection]
  );
  return resultToFetchedStateResponse(result);
}
