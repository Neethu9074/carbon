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
  AreaRoleWithContributor,
  AreaRoleWithContributorType,
  AreaRoleWithCustomType,
  AreaRolesWithContributor,
  ProductAreaType,
  ScopedPermissionItem
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { ContributorFilterWarning } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/ContributorFilterWarning/ContributorFilterWarning';
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
  onChangeRole?: (role: AreaRoleType | AreaRoleWithContributorType) => void;
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
  const isContributor =
    applicationContributionFilterEnabled &&
    entityPermissionKey === 'applicationIds' &&
    role === AreaRoleWithContributor.CONTRIBUTOR;
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
      {isContributor && (
        <StackItem>
          <Typography variant="heading-200" component="h2">
            {t('in-settings:permissionScope.role_permissions')}
          </Typography>
          <ContributorFilterWarning />
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
            ? { options: AreaRolesWithContributor }
            : {})}
        />
      )}
    </Stack>
  );
}
