/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { AuthenticationOverview } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { getAuthOverview } from 'in-settings/tabs/GlobalSettings/api/auth';
import { pendingResult } from 'in-services/fixedObjects';
import { FetchedState } from 'in-hooks/utils/types';

interface UseAuthOverviewProps {
  preventRequest?: boolean;
}

export default function useAuthOverview(props?: UseAuthOverviewProps): FetchedState<AuthenticationOverview> {
  const { preventRequest } = props ?? {};

  const result =
    useObservable(() => {
      if (preventRequest) return just(undefined);

      return getAuthOverview();
    }, [preventRequest]) ?? pendingResult;

  return resultToFetchedStateResponse(result);
}
