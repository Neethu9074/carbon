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
    return getRolesOverview().map(response => {
      const { data } = response;
      if (!data) return response;

      // We temporary filtering out deprecated groups
      const newData = data.filter(({ hasScope }) => !hasScope);
      return {
        ...response,
        data: newData
      };
    });
  }, []);

  return resultToFetchedStateResponse(result);
}
