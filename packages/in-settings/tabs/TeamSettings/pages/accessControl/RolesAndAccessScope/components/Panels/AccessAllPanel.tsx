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
  AreaRoleWithContributer,
  AreaRoleWithCustomType,
  AreaRolesWithContributer,
  ProductAreaType,
  ScopedPermissionItem
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { ContributerFilterWarning } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/ContributerFilterWarning/ContributerFilterWarning';
import {
  ConfigurationSummary,
  getConfigurationSummaryMsg
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/ConfigurationSummary';
import RoleFormGroup from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/RoleFormGroup';
import { applicationContributionFilterEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

interface AccessAllPanelProps {
  entityPermissionKey?: string;
  role?: AreaRoleWithCustomType;
  roleTooltipText?: string | React.ReactElement;
  description: string;
  title?: string;
  onChangeRole?: (role: AreaRoleType) => void;
  productArea: ProductAreaType;
}

export default function AccessAllPanel({
  role,
  onChangeRole,
  entityPermissionKey,
  roleTooltipText,
  description,
  title,
  productArea
}: AccessAllPanelProps) {
  const isContributer =
    applicationContributionFilterEnabled &&
    entityPermissionKey === 'applicationIds' &&
    role === AreaRoleWithContributer.CONTRIBUTER;
  const { accessLevelMessage, rolePermissionMessage } = getConfigurationSummaryMsg(
    productArea,
    ScopedPermissionItem.ACCESS_ALL,
    role
  );

  return (
    <Stack direction="vertical">
      {applicationContributionFilterEnabled ? (
        <StackItem>
          <ConfigurationSummary accessLevelMsg={accessLevelMessage} rolePermissionMsg={rolePermissionMessage} />
        </StackItem>
      ) : (
        <StackItem>
          <Typography variant="heading-200" component="div">
            {title ?? t('in-settings:permissionScope.description_access_all')}
          </Typography>
          <Typography variant="body-regular" component="div">
            {description}
          </Typography>
        </StackItem>
      )}
      {isContributer && (
        <StackItem>
          <Typography variant="heading-200" component="h4">
            {t('in-settings:permissionScope.role_permissions')}
          </Typography>
          <ContributerFilterWarning />
        </StackItem>
      )}
      {roleTooltipText && onChangeRole && entityPermissionKey && (
        <RoleFormGroup
          htmlFor={`${entityPermissionKey}-role-select`}
          tooltipText={roleTooltipText}
          value={role}
          defaultRole={AreaRole.VIEWER}
          onChange={onChangeRole}
          {...(entityPermissionKey === 'applicationIds' && applicationContributionFilterEnabled
            ? { options: AreaRolesWithContributer }
            : {})}
        />
      )}
    </Stack>
  );
}
