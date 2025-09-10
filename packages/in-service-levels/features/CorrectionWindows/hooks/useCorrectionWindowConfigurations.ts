/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import type { PaginatedResult, Result, CorrectionConfiguration } from '@instana/types';
import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';

import { getAllCorrectionConfiguration } from 'in-service-levels/api/correctionConfiguration';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { pendingResult } from 'in-services/fixedObjects';

export default function useCorrectionWindowConfigurations({
  sloConfigId
}: {
  sloConfigId?: string;
}): Result<CorrectionConfiguration[]> {
  const result =
    useObservable(() => {
      return getAllCorrectionConfiguration({
        sloId: sloConfigId
      });
    }, [generateStableHash(sloConfigId)]) ?? (pendingResult as Result<PaginatedResult<CorrectionConfiguration>>);
  const [configurations, , errors, progress] = resultToFetchedStateResponse(result);
  return {
    progress,
    data: configurations?.items!,
    errors
  };
}
