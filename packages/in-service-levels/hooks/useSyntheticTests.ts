/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { generateStableHash } from '@instana/utils';
import { SyntheticTest } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { getFilteredSyntheticTests } from 'in-synthetics/api';
import { FetchedState } from 'in-hooks/utils/types';
import { success } from 'in-services/util/result';

interface UseSyntheticTestsProps {
  testIds: string[];
}

export default function useSyntheticTests({ testIds }: UseSyntheticTestsProps): FetchedState<SyntheticTest[]> {
  const result = useObservable(
    () => (testIds.length ? getFilteredSyntheticTests(testIds) : just(success<SyntheticTest[]>([]))),
    [generateStableHash(testIds)]
  );

  return resultToFetchedStateResponse(result);
}
