/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ServiceLevelObjectiveConfiguration, SyntheticTest, Result } from '@instana/types';
import { just, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { loadEntities } from 'in-service-levels/utils/loadEntities';
import { pendingResult } from 'in-services/fixedObjects';
import { FetchedState } from 'in-hooks/utils/types';

export default function useSyntheticTests({
  sloConfig
}: {
  sloConfig?: ServiceLevelObjectiveConfiguration;
}): FetchedState<SyntheticTest[]> | undefined {
  const { entity } = sloConfig ?? {};
  const syntheticTests = useObservable<Result<SyntheticTest[]> | null, []>(() => {
    if (!entity || entity.type !== 'synthetic') {
      return just(null);
    }
    return loadEntities(entity) as Observable<Result<SyntheticTest[]>>;
  }, []);
  if (syntheticTests === null) return undefined;
  return resultToFetchedStateResponse(syntheticTests ?? pendingResult);
}
