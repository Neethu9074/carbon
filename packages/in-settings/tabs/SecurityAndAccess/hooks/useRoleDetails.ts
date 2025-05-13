/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useObservable } from '@instana/hooks';

import { RoleDetailsWithPermissions } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/Roles.types';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { getRoleDetails } from 'in-settings/tabs/SecurityAndAccess/api/roles';
import { pendingResult } from 'in-services/fixedObjects';
import { FetchedState } from 'in-hooks/utils/types';

interface UseRoleDetailsProps {
  id?: string;
}

export default function useRoleDetails({ id }: UseRoleDetailsProps): FetchedState<RoleDetailsWithPermissions> {
  const result = useObservable(() => {
    if (!id) return;

    return getRoleDetails({ id });
  }, [id]);

  return resultToFetchedStateResponse(result ?? pendingResult);
}
