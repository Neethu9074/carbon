/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { ApiGroup, Result } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { Tile } from '@instana/carbon';

import RolesAndAccessScopeOverview from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/RolesAndAccessScopeOverview';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { getGroup } from 'in-settings/tabs/SecurityAndAccess/api/groups';
import { pendingResult } from 'in-services/fixedObjects';

interface RolesAccessScopeTileProps {
  roleId: string;
}

export default function RolesAccessScopeTile({ roleId }: RolesAccessScopeTileProps) {
  const result = useObservable(() => getGroup(roleId), [roleId]) ?? (pendingResult as Result<ApiGroup>);
  const [group] = resultToFetchedStateResponse(result);

  if (!group) return <></>;

  return (
    <Tile>
      <RolesAndAccessScopeOverview permissionsSet={group.permissionSet} />
    </Tile>
  );
}
