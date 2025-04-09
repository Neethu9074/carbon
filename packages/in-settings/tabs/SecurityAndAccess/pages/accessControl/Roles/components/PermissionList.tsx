/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { CarbonContainedList, CarbonContainedListItem } from '@instana/components';
import { t } from 'in-i18n';
import { ProductAreaPermissionUnion } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/roleForm';
import React from 'react';

interface PermissionListProps {
  availablePermissions: Array<ProductAreaPermissionUnion>;
  enabledPermissions?: Array<ProductAreaPermissionUnion>;
}

export default function PermissionList({ availablePermissions, enabledPermissions = [] }: PermissionListProps) {
  const permissionList = availablePermissions.filter(permission => enabledPermissions.includes(permission));
  const hasPermissions = !!permissionList.length;
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
