/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { CorrectionConfiguration } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { getCorrectionConfiguration } from 'in-service-levels/api/correctionConfiguration';
import { FetchedState } from 'in-hooks/utils/types';

export default function useCorrectionConfiguration(id: string): FetchedState<CorrectionConfiguration> {
  const result = useObservable(() => getCorrectionConfiguration(id), [id]);

  return resultToFetchedStateResponse(result);
}
