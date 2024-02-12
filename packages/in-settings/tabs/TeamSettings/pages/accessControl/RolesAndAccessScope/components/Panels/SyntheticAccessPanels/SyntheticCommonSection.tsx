/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapFormItems } from 'formalistic';
import React from 'react';

import { SvgIcon, Stack, StackItem, Typography } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { PermissionSet } from '@instana/types';

import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import { getField, updateFormField } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import { ProductArea } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import { Capability } from 'in-stores/permission';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './SyntheticCommonSection.mless';

export default function SyntheticCredentialSection<FORM_TYPE extends MapFormItems>({
  form,
  setForm
}: FormControlProps<FORM_TYPE>) {
  const productArea = ProductArea.SYNTHETICS;
  const useCredentialLabel = t('in-stores:permissionCanUseSyntheticCredentialsLabel');
  const configCredentialLabel = t('in-stores:permissionCanConfigureSyntheticCredentialsLabel');
  const configLocationLabel = t('in-stores:permissionCanConfigureSyntheticLocationsLabel');
  const area = {
    header: productArea,
    capabilities: [
      {
        keyForGroupApi: Capability.CAN_CONFIGURE_SYNTHETIC_LOCATIONS,
        label: configLocationLabel,
        description: t('in-settings:tabs.permitsAccessToLabelMonitoringFunctionality', { label: configLocationLabel })
      },
      {
        keyForGroupApi: Capability.CAN_USE_SYNTHETIC_CREDENTIALS,
        label: useCredentialLabel,
        description: t('in-settings:tabs.permitsAccessToLabelMonitoringFunctionality', { label: useCredentialLabel })
      },
      {
        keyForGroupApi: Capability.CAN_CONFIGURE_SYNTHETIC_CREDENTIALS,
        label: configCredentialLabel,
        description: t('in-settings:tabs.permitsAccessToLabelMonitoringFunctionality', { label: configCredentialLabel })
      }
    ]
  };

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
      <Typography variant="heading-200" component="h4">
        {t('in-settings:productAreas.additionalPermissions')}
      </Typography>
      {area.capabilities.map(productPermission => (
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
                <SvgIcon
                  type="lib_help_error_info_outline"
                  size="s"
                  color={themes.default.ids.color.option.neutral['800']}
                />
              </Tooltip>
            </Stack>
          }
        />
      ))}
    </StackItem>
  );
}
