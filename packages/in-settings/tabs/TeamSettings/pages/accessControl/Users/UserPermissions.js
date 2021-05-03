/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';

import PermissionsList from 'in-settings/tabs/TeamSettings/pages/accessControl/Permissions/PermissionsList.js';
import { productPermissions } from 'in-stores/permission';
import { pendingResult } from 'in-services/fixedObjects';
import { getPermissions } from 'in-api/users';
import theme from 'in-themes';

export default function UserPermissions({ userId }) {
  const permissions = useObservable(getPermissions(userId), [userId]) ?? pendingResult;
  return (
    <PermissionsList
      permissions={productPermissions}
      listActions={[
        {
          id: 'toggleEnabledAction',
          sortable: false,
          width: '5rem',
          widthInAbsoluteUnit: true,
          getContent(entity) {
            return (
              <SvgIcon
                type={permissions.data?.includes(entity.keyForGroupApi) ? 'lib_check' : 'lib_openclose_cancel'}
                color={
                  permissions.data?.includes(entity.keyForGroupApi)
                    ? theme.lib.colors.success
                    : theme.lib.colors.failure
                }
              />
            );
          }
        }
      ]}
    />
  );
}
