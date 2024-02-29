/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapFormItems } from 'formalistic';
import React from 'react';

import { SvgIcon, Stack, StackItem, Typography } from '@instana/components';
import { PermissionSet } from '@instana/types';

import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import { getField, updateFormField } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import { CapabilityType, productPermissionsObject } from 'in-stores/permission';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import Tooltip from 'in-components/Tooltip';
import { useTheme } from 'in-themes';
import { t } from 'in-i18n';

import locals from './AdditionalPermissionSection.mless';

export interface AdditionalPermissionSectionProps<FORM_TYPE extends MapFormItems> extends FormControlProps<FORM_TYPE> {
  capabilities: Array<CapabilityType>;
}

export default function AdditionalPermissionSection<FORM_TYPE extends MapFormItems>({
  form,
  setForm,
  capabilities
}: AdditionalPermissionSectionProps<FORM_TYPE>) {
  const theme = useTheme();

  const permissionSetField = getField<PermissionSet>(form, 'permissionSet');
  const permissionSet = permissionSetField?.value;

  const updatePermissionSet = (permissionSet: PermissionSet) => {
    setForm(updateFormField(form, 'permissionSet', permissionSet, true));
  };

  const updatePermission = (value: string) => {
    if (!permissionSet) return;

    const hasToggledCapability = permissionSet.permissions.includes(value);
    const newPermissions = hasToggledCapability
      ? permissionSet.permissions.filter(permission => permission !== value)
      : [...permissionSet.permissions, value];

    updatePermissionSet({ ...permissionSet, permissions: newPermissions });
  };

  return (
    <StackItem>
      <Typography variant="heading-200" component="h2">
        {t('in-settings:productAreas.additionalPermissions')}
      </Typography>
      {capabilities
        .map(capability => productPermissionsObject[capability])
        .map(productPermission => (
          <CheckboxFancy
            key={productPermission.keyForGroupApi}
            size="large"
            className={locals.clickable}
            checked={permissionSet?.permissions.includes(productPermission.keyForGroupApi) || false}
            onChange={() => updatePermission(productPermission.keyForGroupApi)}
            label={
              <Stack gap="xsmall" direction="horizontal" align="start">
                <span>{productPermission.label}</span>
                <Tooltip content={productPermission.description} align="rightMiddle">
                  <SvgIcon type="lib_help_error_info_outline" size="s" color={theme.ids.color.option.neutral['800']} />
                </Tooltip>
              </Stack>
            }
          />
        ))}
    </StackItem>
  );
}
