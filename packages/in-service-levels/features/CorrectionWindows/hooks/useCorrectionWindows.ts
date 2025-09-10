/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import type { Result, Correction } from '@instana/types';
import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import type { GetCorrectionWindowsArguments } from 'in-service-levels/api/correctionConfiguration';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { getCorrectionWindows } from 'in-service-levels/api/correctionConfiguration';
import { pendingResult } from 'in-services/fixedObjects';
import { success } from 'in-services/util/result';

export default function useCorrectionWindows({
  sloConfigId,
  timeConfig,
  excludeCorrectionIds
}: GetCorrectionWindowsArguments): Result<Correction> {
  const result =
    useObservable(() => {
      if (!sloConfigId || !timeConfig) return just(success<Correction>({}));
      return getCorrectionWindows({ sloConfigId, timeConfig, excludeCorrectionIds });
    }, [generateStableHash(timeConfig), sloConfigId, generateStableHash(excludeCorrectionIds)]) ??
    (pendingResult as Result<Correction>);
  const [correction, , errors, progress] = resultToFetchedStateResponse(result);
  return {
    progress,
    data: correction,
    errors
  };
}
