/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapFormItems } from 'formalistic';
import React from 'react';

import { Stack, StackItem } from '@instana/components';

import {
  AreaRole,
  AreaRoleType,
  AreaRoleWithContributorType,
  AreaRoleWithCustomType,
  ProductArea,
  ScopedPermissionItem
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import {
  ConfigurationSummary,
  getConfigurationSummaryMsg
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/ConfigurationSummary';
import SyntheticCommonSection from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/Panels/SyntheticAccessPanels/SyntheticCommonSection';
import { FormControlProps } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import RoleFormGroup from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/RoleFormGroup';

interface SyntheticAccessPanelProps<FORM_TYPE extends MapFormItems> extends FormControlProps<FORM_TYPE> {
  entityPermissionKey?: string;
  role?: AreaRoleWithCustomType;
  roleTooltipText?: string | React.ReactElement;
  onChangeRole?: (role: AreaRoleType | AreaRoleWithContributorType) => void;
}

export default function SyntheticAccessAllPanel<FORM_TYPE extends MapFormItems>({
  role,
  form,
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
            value={role}
            defaultRole={AreaRole.VIEWER}
            onChange={onChangeRole}
            roleDescription={rolePermissionMessage}
          />
        )}
      </>
    );
  };
  return (
    <Stack direction="vertical">
      <StackItem>
        <ConfigurationSummary accessLevelType={ScopedPermissionItem.ACCESS_ALL} accessLevelMsg={accessLevelMessage}>
          <RoleSelectionSection />
          <SyntheticCommonSection form={form} setForm={setForm} role={role} />
        </ConfigurationSummary>
      </StackItem>
    </Stack>
  );
}
