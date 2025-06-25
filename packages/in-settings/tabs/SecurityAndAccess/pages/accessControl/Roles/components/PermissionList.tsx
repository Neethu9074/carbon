/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonContainedList, CarbonContainedListItem, LoadingSkeleton } from '@instana/components';

import { ProductAreaPermissionUnion } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/Roles.types';
import { Capability, LimitedAccessScopeType } from 'in-stores/permission';
import { newOTelPageEnabled } from 'in-services/featureFlags';
import { FetchStatus } from 'in-hooks/utils/types';
import { t } from 'in-i18n';

function getListHeaderLabel({
  hasAreaAccess,
  hasLimitedAccess,
  hasScope,
  limitingAccessScope
}: Pick<PermissionListProps, 'hasLimitedAccess' | 'limitingAccessScope' | 'hasScope' | 'hasAreaAccess'>) {
  if (!limitingAccessScope) {
    return t('in-settings:details.role.permissionListHeader');
  }

  /**
   * <-- CONDITIONS TO SUPPORT LEGACY GROUP PERMISSIONS -->
   **/

  if (hasScope && hasLimitedAccess && hasAreaAccess) {
    return t('in-settings:details.role.permissionListHeader', { context: 'limitedAccess' });
  }

  if (hasScope && hasLimitedAccess && !hasAreaAccess) {
    return t('in-settings:details.role.permissionListHeader', { context: 'noAccess' });
  }

  /**
   * <-- END -->
   **/

  if (hasLimitedAccess) {
    return t('in-settings:details.role.permissionListHeader', { context: 'noAccess' });
  }

  return t('in-settings:dialogs.role.permissionLabel', { context: limitingAccessScope });
}

interface PermissionListProps {
  availablePermissions: Array<ProductAreaPermissionUnion>;
  enabledPermissions?: Array<ProductAreaPermissionUnion>;
  /**
   * @deprecated Can be removed as soon as the groups have been fully migrated to roles
   **/
  hasAreaAccess?: boolean;
  hasLimitedAccess?: boolean;
  /**
   * @deprecated Can be removed as soon as the groups have been fully migrated to roles
   **/
  hasScope?: boolean;
  limitingAccessScope?: LimitedAccessScopeType;
  status: FetchStatus;
}

export default function PermissionList({
  availablePermissions,
  enabledPermissions = [],
  hasAreaAccess,
  hasLimitedAccess,
  hasScope,
  limitingAccessScope,
  status
}: PermissionListProps) {
  const label = getListHeaderLabel({ hasAreaAccess, hasLimitedAccess, hasScope, limitingAccessScope });
  const permissionList = availablePermissions.filter(permission => enabledPermissions.includes(permission));

  if (status === 'pending') {
    return (
      <CarbonContainedList label={label} kind="disclosed">
        {availablePermissions.map((_, index) => (
          <CarbonContainedListItem key={`permission-list-item-${index}`}>
            <LoadingSkeleton />
          </CarbonContainedListItem>
        ))}
      </CarbonContainedList>
    );
  }

  return (
    <CarbonContainedList label={label} kind="disclosed">
      {permissionList.map((permission, index) => (
        <CarbonContainedListItem key={`permission-list-item-${index}`}>
          {t('in-settings:dialogs.role.permissionLabel', {
            context:
              newOTelPageEnabled && permission === Capability.CAN_CONFIGURE_AGENTS
                ? 'CAN_CONFIGURE_AGENTS_AND_COLLECTORS'
                : permission
          })}
        </CarbonContainedListItem>
      ))}
    </CarbonContainedList>
  );
}
