/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapFormItems } from 'formalistic';
import React from 'react';

import { Stack, StackItem, Typography } from '@instana/components';

import {
  AreaRole,
  AreaRoleType,
  AreaRoleWithContributorType,
  AreaRoleWithCustomType,
  ProductArea,
  ScopedPermissionItem
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import {
  ConfigurationSummary,
  getConfigurationSummaryMsg
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/ConfigurationSummary';
import SyntheticCommonSection from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/Panels/SyntheticAccessPanels/SyntheticCommonSection';
import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import RoleFormGroup from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/RoleFormGroup';
import { applicationContributionFilterEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

interface SyntheticAccessPanelProps<FORM_TYPE extends MapFormItems> extends FormControlProps<FORM_TYPE> {
  entityPermissionKey?: string;
  role?: AreaRoleWithCustomType;
  roleTooltipText?: string | React.ReactElement;
  description: string;
  onChangeRole?: (role: AreaRoleType | AreaRoleWithContributorType) => void;
}

export default function SyntheticAccessAllPanel<FORM_TYPE extends MapFormItems>({
  role,
  form,
  description,
  setForm,
  entityPermissionKey,
  roleTooltipText,
  onChangeRole
}: SyntheticAccessPanelProps<FORM_TYPE>) {
  const { accessLevelMessage, rolePermissionMessage } = getConfigurationSummaryMsg(
    ProductArea.SYNTHETICS,
    ScopedPermissionItem.ACCESS_ALL,
    role
  );
  const RoleSelectionSection = () => {
    return (
      <>
        {roleTooltipText && onChangeRole && entityPermissionKey && (
          <RoleFormGroup
            htmlFor={`${entityPermissionKey}-role-select`}
            tooltipText={roleTooltipText}
            value={role}
            defaultRole={AreaRole.VIEWER}
            onChange={onChangeRole}
          />
        )}
        {role === AreaRole.OWNER && <SyntheticCommonSection form={form} setForm={setForm} />}
      </>
    );
  };
  return (
    <Stack direction="vertical">
      {applicationContributionFilterEnabled ? (
        <StackItem>
          <ConfigurationSummary
            accessLevelTitle={ScopedPermissionItem.ACCESS_ALL.toLocaleLowerCase()}
            accessLevelMsg={accessLevelMessage}
            rolePermissionMsg={rolePermissionMessage}
          >
            <RoleSelectionSection />
          </ConfigurationSummary>
        </StackItem>
      ) : (
        <>
          <StackItem>
            <Typography variant="heading-200" component="div">
              {t('in-settings:permissionScope.description_access_all')}
            </Typography>
            <Typography variant="body-regular" component="div">
              {description}
            </Typography>
          </StackItem>
          <StackItem>
            <RoleSelectionSection />
          </StackItem>
        </>
      )}
    </Stack>
  );
}
