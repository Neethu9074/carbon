/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SvgIcon, Stack, StackItem, Typography } from '@instana/components';
import { PermissionSetWithRoles } from '@instana/types';

import {
  AreaRole,
  AreaRoleWithCustomType,
  ScopedPermissionItem,
  ProductArea
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import {
  getField,
  updateFormField,
  updatePermissionSetForLimitableProductArea
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import FormGroup from 'in-settings/components/FormGroup';
import { AreaPermission } from 'in-stores/permission';
import Input from 'in-components/form/Input';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

interface InfrastructureAccessPanelProps extends FormControlProps {
  role?: AreaRoleWithCustomType;
  description: string;
}

export default function InfrastructureAccessPanel({
  role,
  form,
  description,
  setForm
}: InfrastructureAccessPanelProps) {
  const productArea = ProductArea.INFRASTRUCTURE;
  const entityPermissionKey = 'infraDfqFilter';
  const label = t('in-stores:permissionAccessInfrastructureAnalyzeLabel');
  const area = {
    header: productArea,
    capabilities: [
      {
        keyForGroupApi: AreaPermission.ACCESS_INFRASTRUCTURE_ANALYZE,
        label: label,
        description: t('in-settings:tabs.permitsAccessToLabelMonitoringFunctionality', { label: label })
      }
    ]
  };
  const permissionSetField = getField<PermissionSetWithRoles>(form, 'permissionSet');
  const permissionSet = permissionSetField?.value;
  const infraDfqFilter = permissionSetField?.value[entityPermissionKey]?.scopeId ?? '';
  // workaround as role is for now unused
  role = role ? role : AreaRole.VIEWER;

  const updatePermissionSet = (permissionSet: PermissionSetWithRoles) => {
    setForm(updateFormField(form, 'permissionSet', permissionSet, true));
  };

  const updateInfraDfq = (infraDfq: string) => {
    if (!permissionSet) return;

    const limitation = !infraDfq ? ScopedPermissionItem.ACCESS_ALL : ScopedPermissionItem.LIMITED_ACCESS;
    const restPermissionSet = updatePermissionSetForLimitableProductArea(
      permissionSet,
      productArea,
      limitation,
      undefined
    );
    const infraScope = { scopeId: infraDfq ? infraDfq : '', scopeRoleId: '-600' };
    updatePermissionSet({ ...restPermissionSet, [entityPermissionKey]: infraScope });
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
    <Stack direction="vertical">
      <StackItem>
        <Typography variant="heading-200" component="div">
          {t('in-settings:PermissionSection.infrastructureAccessScope')}
        </Typography>
        <Typography variant="body-regular" component="div">
          {description}
        </Typography>
      </StackItem>
      <StackItem>
        <Typography variant="body-bold" component="div">
          {t('in-settings:PermissionSection.infrastructureDfqHeader')}
        </Typography>
        <InfraDfq infraDfqFilter={infraDfqFilter} update={updateInfraDfq} />
        <Typography variant="code" component="div">
          {t('in-settings:PermissionSection.infrastructureDfqExample')}
        </Typography>
      </StackItem>
      <StackItem>
        <Typography variant="heading-200" component="h4">
          {t('in-settings:productAreas.permissions', { context: area.header })}
        </Typography>
        {area.capabilities.map(productPermission => (
          <CheckboxFancy
            key={productPermission.keyForGroupApi}
            size="large"
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
  );
}

export interface InfraDfqProps {
  infraDfqFilter: string;
  update: any;
}

export function InfraDfq({ infraDfqFilter, update }: InfraDfqProps) {
  return (
    <FormGroup>
      <Input id="infra-dfq-filter" value={infraDfqFilter} onChange={e => update(e.target.value)} />
    </FormGroup>
  );
}
