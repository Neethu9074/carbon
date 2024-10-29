/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useContext } from 'react';

import { Typography } from '@instana/components';

import { RolesAndAccessScopeContext } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/context';
import { AreaExpandableListItem } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Areas/AreaExpandableListItem';
import { LimitedAccessScope } from 'in-stores/permission';
import { t } from 'in-i18n';

export const BusinessMonitoringSection = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  // This logic will need to change once limited access is introduced for BizOps
  const hasBizOpsAccess = !permissionsSet.permissions.includes(LimitedAccessScope.LIMITED_BIZOPS_SCOPE);
  const context = hasBizOpsAccess ? 'access_all' : 'no_access';
  const props = {
    iconType: 'lib_bizops',
    firstColumnHeadline: t('in-settings:permissionScope.selection', {
      context: context
    }),
    firstColumnLabel: t('in-settings:productAreas.title_businessMonitoring'),
    disabled: !hasBizOpsAccess
  };

  if (hasBizOpsAccess) {
    return (
      <AreaExpandableListItem {...props}>
        <Typography variant="body-small">{t('in-settings:productAreas.businessMonitoringAccessAllMessage')}</Typography>
      </AreaExpandableListItem>
    );
  } else {
    return <AreaExpandableListItem {...props} />;
  }
};
