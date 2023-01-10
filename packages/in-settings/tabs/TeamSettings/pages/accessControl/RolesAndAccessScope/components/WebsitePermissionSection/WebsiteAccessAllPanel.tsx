/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Stack, StackItem, Typography } from '@instana/components';

import RoleFormGroup from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/RoleFormGroup';
import { AreaRoleType } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { t } from 'in-i18n';

interface WebsiteAccessAllPanelProps {
  role?: AreaRoleType;
  onChangeRole: (role: AreaRoleType) => void;
}

export default function WebsiteAccessAllPanel({ role, onChangeRole }: WebsiteAccessAllPanelProps) {
  return (
    <Stack direction="vertical">
      <StackItem>
        <Typography variant="heading-200" component="div">
          {t('in-settings:permissionScope.description_access_all')}
        </Typography>
        <Typography variant="body-regular" component="div">
          {t('in-settings:websitePermissionSection.description_access_all')}
        </Typography>
      </StackItem>
      <RoleFormGroup
        htmlFor="website-role-select"
        tooltipText={t('in-settings:permissionScope.roleTooltip', { context: 'websites' })}
        defaultRole={role}
        onChange={onChangeRole}
      />
    </Stack>
  );
}
