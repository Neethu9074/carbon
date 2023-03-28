/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack, StackItem, Typography } from '@instana/components';

import {
  AreaRole,
  AreaRoleType,
  AreaRoleWithCustomType
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import RoleFormGroup from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/RoleFormGroup';
import { t } from 'in-i18n';

interface AccessAllPanelProps {
  entityPermissionKey?: string;
  role?: AreaRoleWithCustomType;
  roleTooltipText?: string;
  description: string;
  title?: string;
  onChangeRole?: (role: AreaRoleType) => void;
}

export default function AccessAllPanel({
  role,
  onChangeRole,
  entityPermissionKey,
  roleTooltipText,
  description,
  title
}: AccessAllPanelProps) {
  return (
    <Stack direction="vertical">
      <StackItem>
        <Typography variant="heading-200" component="div">
          {title ?? t('in-settings:permissionScope.description_access_all')}
        </Typography>
        <Typography variant="body-regular" component="div">
          {description}
        </Typography>
      </StackItem>
      {roleTooltipText && onChangeRole && entityPermissionKey && (
        <RoleFormGroup
          htmlFor={`${entityPermissionKey}-role-select`}
          tooltipText={roleTooltipText}
          value={role}
          defaultRole={AreaRole.VIEWER}
          onChange={onChangeRole}
        />
      )}
    </Stack>
  );
}
