/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapFormItems } from 'formalistic';
import React from 'react';

import { SvgIcon, Stack, StackItem, Typography, Checkbox } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { PermissionSet } from '@instana/types';

import {
  AreaRole,
  AreaRoleWithCustomType,
  ProductArea,
  syntheticCredentialCapabilities
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { FormControlProps } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import {
  getField,
  updateFormField
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import { Capability, CapabilityType, productPermissionsObject } from 'in-stores/permission';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './SyntheticCommonSection.mless';

interface SyntheticCredentialSectionProps<FORM_TYPE extends MapFormItems> extends FormControlProps<FORM_TYPE> {
  role?: AreaRoleWithCustomType;
}

export default function SyntheticCredentialSection<FORM_TYPE extends MapFormItems>({
  form,
  setForm,
  role
}: SyntheticCredentialSectionProps<FORM_TYPE>) {
  const productArea = ProductArea.SYNTHETICS;
  const area = {
    header: productArea,
    capabilities: [productPermissionsObject[Capability.CAN_CONFIGURE_GLOBAL_SYNTHETIC_SMART_ALERTS]]
  };
  if (role === AreaRole.OWNER) {
    area.capabilities = [
      productPermissionsObject[Capability.CAN_CONFIGURE_SYNTHETIC_LOCATIONS],
      productPermissionsObject[Capability.CAN_USE_SYNTHETIC_CREDENTIALS],
      productPermissionsObject[Capability.CAN_CONFIGURE_SYNTHETIC_CREDENTIALS],
      ...area.capabilities
    ];
  }
  const permissionSetField = getField<PermissionSet>(form, 'permissionSet');
  const permissionSet = permissionSetField?.value;

  const updatePermissionSet = (permissionSet: PermissionSet) => {
    setForm(updateFormField(form, 'permissionSet', permissionSet, true));
  };

  const updatePermission = (value: CapabilityType) => {
    if (!permissionSet) return;

    const hasToggledCapability = permissionSet.permissions.includes(value);
    const newPermissions = hasToggledCapability
      ? permissionSet.permissions.filter(permission => permission !== value)
      : [...permissionSet.permissions, value];
    const hasCredentialPermission = newPermissions.some(permission =>
      syntheticCredentialCapabilities.includes(permission as CapabilityType)
    );
    if (hasToggledCapability && syntheticCredentialCapabilities.includes(value) && !hasCredentialPermission) {
      updatePermissionSet({ ...permissionSet, permissions: newPermissions, ['syntheticCredentialKeys']: [] });
    } else {
      updatePermissionSet({ ...permissionSet, permissions: newPermissions });
    }
  };

  return (
    <StackItem>
      <Typography variant="heading-200" component="h4">
        {t('in-settings:productAreas.additionalPermissions')}
      </Typography>
      {area.capabilities.map(productPermission => (
        <Checkbox
          key={productPermission.keyForGroupApi}
          size="large"
          className={locals.clickable}
          checked={permissionSet?.permissions.includes(productPermission.keyForGroupApi) || false}
          onChange={() => updatePermission(productPermission.keyForGroupApi)}
          label={
            <Stack gap="xsmall" direction="horizontal" align="start">
              <span>{productPermission.label}</span>
              {productPermission.description && (
                <Tooltip content={productPermission.description} align="auto">
                  <SvgIcon
                    type="lib_help_error_info_outline"
                    size="s"
                    color={themes.default.ids.color.option.neutral['800']}
                  />
                </Tooltip>
              )}
            </Stack>
          }
        />
      ))}
    </StackItem>
  );
}
