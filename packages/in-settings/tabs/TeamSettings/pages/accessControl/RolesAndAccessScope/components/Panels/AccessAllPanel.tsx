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
  AreaRoleWithContributerType,
  AreaRoleWithCustomType,
  AreaRolesWithContributer
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { ContributerFilterWarning } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/ContributerFilterWarning/ContributerFilterWarning';
import RoleFormGroup from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/RoleFormGroup';
import { t } from 'in-i18n';

interface AccessAllPanelProps {
  entityPermissionKey?: string;
  role?: AreaRoleWithCustomType | AreaRoleWithContributerType;
  roleTooltipText?: string | React.ReactElement;
  description: string;
  title?: string;
  onChangeRole?: (role: AreaRoleType) => void;
  isContributerRole?: boolean;
}

export default function AccessAllPanel({
  role,
  onChangeRole,
  entityPermissionKey,
  roleTooltipText,
  description,
  title,
  isContributerRole
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
      {isContributerRole && (
        <>
          <Typography variant="heading-200" component="div">
            {t('in-settings:permissionScope.role_permissions')}
          </Typography>
          <ContributerFilterWarning />
        </>
      )}
      {roleTooltipText && onChangeRole && entityPermissionKey && (
        <RoleFormGroup
          htmlFor={`${entityPermissionKey}-role-select`}
          tooltipText={roleTooltipText}
          value={role}
          defaultRole={AreaRole.VIEWER}
          onChange={onChangeRole}
          {...(entityPermissionKey === 'applicationIds' ? { options: AreaRolesWithContributer } : {})}
        />
      )}
    </Stack>
  );
}
