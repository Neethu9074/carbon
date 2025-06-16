/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { PaginatedResult, Result, Correction, CorrectionConfiguration } from '@instana/types';
import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import {
  GetCorrectionWindowsArguments,
  getAllCorrectionConfiguration,
  getCorrectionWindows
} from 'in-service-levels/api/correctionConfiguration';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { all as allProgress } from 'in-hooks/utils/progress';
import { pendingResult } from 'in-services/fixedObjects';
import { FetchedState } from 'in-hooks/utils/types';
import { success } from 'in-services/util/result';

export interface CorrectionWithConfiguration {
  correction: Correction;
  configurations: CorrectionConfiguration[];
}

export default function useCorrectionWindows({
  sloConfigId,
  timeConfig
}: GetCorrectionWindowsArguments): FetchedState<CorrectionWithConfiguration> {
  const result =
    useObservable(() => {
      if (!sloConfigId || !timeConfig) return just(success<Correction>({}));
      return getCorrectionWindows({ sloConfigId, timeConfig });
    }, [generateStableHash(timeConfig), sloConfigId]) ?? (pendingResult as Result<Correction>);
  const [correction, , correctionErrors, correctionProgress] = resultToFetchedStateResponse(result);
  const configurationsResult =
    useObservable(() => {
      return getAllCorrectionConfiguration({
        sloId: sloConfigId
      });
    }, [generateStableHash(sloConfigId)]) ?? (pendingResult as Result<PaginatedResult<CorrectionConfiguration>>);
  const [configurations, , configurationsErrors, configurationsProgress] =
    resultToFetchedStateResponse(configurationsResult);
  const progress = allProgress(configurationsProgress, correctionProgress);
  const errors = [...configurationsErrors, ...correctionErrors];
  return [
    {
      correction: correction!,
      configurations: configurations?.items!
    },
    'resolved',
    errors,
    progress
  ];
}
