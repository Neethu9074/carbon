/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Result, SyntheticTest } from '@instana/types';
import { combineLatest } from '@instana/observables';
import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { pendingResult } from 'in-services/fixedObjects';
import { FetchedState } from 'in-hooks/utils/types';
import { getTest } from 'in-synthetics/api';

interface UseSyntheticTestsProps {
  testIds: string[];
}

export default function useSyntheticTests({ testIds }: UseSyntheticTestsProps): FetchedState<SyntheticTest[]> {
  const result = useObservable(
    () => combineLatest(testIds.map(testId => getTest(testId))),
    [generateStableHash(testIds)]
  );

  const combinedResult: Result<SyntheticTest[]> = (result ?? []).reduce(
    (prevResult, curResult) => {
      const hasData = curResult.data !== null && curResult.data !== undefined;
      const loading = prevResult.progress.loading || curResult.progress.loading;
      const prevData: SyntheticTest[] = prevResult.data ?? [];
      const data: SyntheticTest[] = hasData ? [...prevData, curResult.data!] : prevData;

      return {
        data,
        errors: [...prevResult.errors, ...curResult.errors],
        progress: { loading }
      };
    },
    {
      ...pendingResult,
      data: [],
      progress: { loading: false }
    } as Result<SyntheticTest[]>
  );

  return resultToFetchedStateResponse(combinedResult);
}
