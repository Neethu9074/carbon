/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonContainedList, CarbonContainedListItem, LoadingSkeleton } from '@instana/components';

import { ProductAreaPermissionUnion } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/Roles.types';
import { FetchStatus } from 'in-hooks/utils/types';
import { t } from 'in-i18n';

interface PermissionListProps {
  availablePermissions: Array<ProductAreaPermissionUnion>;
  enabledPermissions?: Array<ProductAreaPermissionUnion>;
  status: FetchStatus;
}

export default function PermissionList({ availablePermissions, enabledPermissions = [], status }: PermissionListProps) {
  const permissionList = availablePermissions.filter(permission => enabledPermissions.includes(permission));
  const hasPermissions = !!permissionList.length;

  if (status === 'pending') {
    return (
      <CarbonContainedList label={t('in-settings:details.role.permissionListHeader')} kind={'disclosed'}>
        {availablePermissions.map((_, index) => (
          <CarbonContainedListItem key={`permission-list-item-${index}`}>
            <LoadingSkeleton />
          </CarbonContainedListItem>
        ))}
      </CarbonContainedList>
    );
  }

  return (
    <CarbonContainedList label={t('in-settings:details.role.permissionListHeader')} kind={'disclosed'}>
      {!hasPermissions ? (
        <CarbonContainedListItem>{t('in-settings:details.role.noPermission')}</CarbonContainedListItem>
      ) : (
        permissionList.map((permission, index) => (
          <CarbonContainedListItem key={`permission-list-item-${index}`}>
            {t('in-settings:dialogs.role.permissionLabel', { context: permission })}
          </CarbonContainedListItem>
        ))
      )}
    </CarbonContainedList>
  );
}
