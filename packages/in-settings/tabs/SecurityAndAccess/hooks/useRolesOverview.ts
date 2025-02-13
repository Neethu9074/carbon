/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { getRolesOverview } from 'in-settings/tabs/SecurityAndAccess/api/roles';

export default function useRolesOverview() {
  const result = useObservable(() => {
    return getRolesOverview();
  }, []);

  return resultToFetchedStateResponse(result);
}
