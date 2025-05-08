/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { pendingResult } from 'in-services/fixedObjects';
import { FetchedState } from 'in-hooks/utils/types';
import { getUsersResult } from 'in-api/users';
import { UserResult } from 'in-types';

export default function useUserList(): FetchedState<UserResult[]> {
  const result = useObservable(() => getUsersResult({}), []) ?? pendingResult;

  return resultToFetchedStateResponse(result);
}
