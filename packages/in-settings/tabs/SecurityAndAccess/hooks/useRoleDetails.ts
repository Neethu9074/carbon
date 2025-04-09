/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useObservable } from '@instana/hooks';

import { ApiRoleWithPermissions } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/Roles.types';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { getRole } from 'in-settings/tabs/SecurityAndAccess/api/roles';
import { pendingResult } from 'in-services/fixedObjects';
import { FetchedState } from 'in-hooks/utils/types';

interface UseRoleDetailsProps {
  id?: string;
}

export default function useRoleDetails({ id }: UseRoleDetailsProps): FetchedState<ApiRoleWithPermissions> {
  const result = useObservable(() => {
    if (!id) return;

    return getRole({ id });
  }, [id]);

  return resultToFetchedStateResponse(result ?? pendingResult);
}
