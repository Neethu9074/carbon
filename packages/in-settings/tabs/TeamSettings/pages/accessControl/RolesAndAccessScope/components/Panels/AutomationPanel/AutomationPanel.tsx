/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapFormItems } from 'formalistic';
import React from 'react';

import { SvgIcon, Stack, StackItem, Typography, Checkbox } from '@instana/components';
import { PermissionSet } from '@instana/types';

import {
  AreaRole,
  AreaRoles,
  AreaRoleWithCustomType,
  automationAdditionalCapabilities,
  automationViewCapabilities,
  ProductArea,
  ScopedPermissionType
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import {
  ConfigurationSummary,
  getConfigurationSummaryMsg
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/ConfigurationSummary';
import {
  getField,
  updateFormField,
  updatePermissionSetForLimitableProductArea
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import RoleFormGroup from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/RoleFormGroup';
import { productPermissionsObject } from 'in-stores/permission';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './AutomationPanel.mless';

interface AutomationAccessPanelProps<FORM_TYPE extends MapFormItems> extends FormControlProps<FORM_TYPE> {
  scopedPermissionItem: ScopedPermissionType;
  role: AreaRoleWithCustomType | undefined;
}

export default function AutomationAccessPanel<FORM_TYPE extends MapFormItems>({
  form,
  setForm,
  scopedPermissionItem,
  role
}: AutomationAccessPanelProps<FORM_TYPE>) {
  const productArea = ProductArea.AUTOMATION;
  const permissionSetField = getField<PermissionSet>(form, 'permissionSet');
  const permissionSet = permissionSetField?.value;

  const capabilities =
    role === 'OWNER' ? automationAdditionalCapabilities : role === 'VIEWER' ? automationViewCapabilities : [];

  const areaPermissions = capabilities.map(capability => productPermissionsObject[capability]);
  const updatePermission = (value: string) => {
    if (!permissionSet) return;

    const hasToggledCapability = permissionSet.permissions.includes(value);
    const newPermissions = hasToggledCapability
      ? permissionSet.permissions.filter(permission => permission !== value)
      : [...permissionSet.permissions, value];

    setForm(updateFormField(form, 'permissionSet', { ...permissionSet, permissions: newPermissions }, true));
  };

  const onChangeRole = (selected: AreaRoleWithCustomType | undefined, limitation: ScopedPermissionType) => {
    if (!permissionSet || selected === 'CUSTOM') return;

    const newPermissionSet = updatePermissionSetForLimitableProductArea(
      permissionSet,
      productArea,
      limitation,
      selected
    );

    setForm(updateFormField(form, 'permissionSet', newPermissionSet, true));
  };

  const { accessLevelMessage, rolePermissionMessage } = getConfigurationSummaryMsg(
    ProductArea.AUTOMATION,
    scopedPermissionItem,
    role
  );

  return (
    <Stack direction="vertical">
      <ConfigurationSummary accessLevelType={scopedPermissionItem} accessLevelMsg={accessLevelMessage}>
        <Stack>
          <StackItem>
            <RoleFormGroup
              htmlFor="automation-role-select"
              value={role}
              defaultRole={AreaRole.VIEWER}
              onChange={selected => onChangeRole(selected, scopedPermissionItem)}
              roleDescription={rolePermissionMessage}
              options={AreaRoles}
            />
          </StackItem>
          <StackItem>
            <Typography variant="heading-200" component="h4">
              {t('in-settings:productAreas.additionalPermissions')}
            </Typography>
            {areaPermissions.map(productPermission => (
              <Checkbox
                key={productPermission.keyForGroupApi}
                size="large"
                className={locals.clickable}
                checked={permissionSet?.permissions.includes(productPermission.keyForGroupApi) || false}
                onChange={() => updatePermission(productPermission.keyForGroupApi)}
                label={
                  <Stack gap="xsmall" direction="horizontal" align="start">
                    <span>{productPermission.label}</span>
                    <Tooltip content={productPermission.description} align="rightMiddle">
                      <SvgIcon type="lib_help_error_info_outline" size="s" color={'#172429'} />
                    </Tooltip>
                  </Stack>
                }
              />
            ))}
          </StackItem>
        </Stack>
      </ConfigurationSummary>
    </Stack>
  );
}
