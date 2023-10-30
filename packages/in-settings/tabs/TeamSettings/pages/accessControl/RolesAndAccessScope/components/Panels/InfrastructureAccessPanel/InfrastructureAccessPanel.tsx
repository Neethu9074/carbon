/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapFormItems } from 'formalistic';
import React from 'react';

import { SvgIcon, Stack, StackItem, Typography } from '@instana/components';
import { PermissionSet } from '@instana/types';
import { Link } from '@instana/components';

import {
  AreaRole,
  AreaRoleWithCustomType,
  ScopedPermissionItem,
  ProductArea
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
import { applicationContributionFilterEnabled } from 'in-services/featureFlags';
//@ts-ignore
import DfqSearchBar from 'in-components/SearchBar/DfqSearchBar';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import { getInfrastructurePermissions } from 'in-stores/permission';
import FormGroup from 'in-settings/components/FormGroup';
import Label from 'in-components/form/Label';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locales from './InfrastructureAccessPanel.mless';

interface InfrastructureAccessPanelProps<FORM_TYPE extends MapFormItems> extends FormControlProps<FORM_TYPE> {
  role?: AreaRoleWithCustomType;
  description: string;
}

export default function InfrastructureAccessPanel<FORM_TYPE extends MapFormItems>({
  role,
  form,
  description,
  setForm
}: InfrastructureAccessPanelProps<FORM_TYPE>) {
  const productArea = ProductArea.INFRASTRUCTURE;
  const entityPermissionKey = 'infraDfqFilter';

  const area = {
    header: productArea,
    capabilities: getInfrastructurePermissions()
  };
  const permissionSetField = getField<PermissionSet>(form, 'permissionSet');
  const permissionSet = permissionSetField?.value;
  const infraDfqFilter = permissionSetField?.value[entityPermissionKey]?.scopeId ?? '';
  // workaround as role is for now unused
  role = role ? role : AreaRole.VIEWER;

  const updatePermissionSet = (permissionSet: PermissionSet) => {
    setForm(updateFormField(form, 'permissionSet', permissionSet, true));
  };

  const updateInfraDfq = (infraDfq: string) => {
    if (!permissionSet) return;

    const limitation = !infraDfq ? ScopedPermissionItem.ACCESS_ALL : ScopedPermissionItem.LIMITED_ACCESS;
    const restPermissionSet = updatePermissionSetForLimitableProductArea(permissionSet, productArea, limitation);
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

  const { accessLevelMessage, rolePermissionMessage } = getConfigurationSummaryMsg(
    ProductArea.INFRASTRUCTURE,
    ScopedPermissionItem.LIMITED_ACCESS,
    AreaRole.OWNER
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
            {t('in-settings:PermissionSection.infrastructureAccessScope')}
          </Typography>
          <Typography variant="body-regular" component="div">
            {description}
          </Typography>
        </StackItem>
      )}
      <StackItem>
        <Typography variant="body-regular" component="div">
          {t('in-settings:PermissionSection.infrastructureDfqUse')}&nbsp;
          <Link
            external
            href="https://www.ibm.com/docs/en/instana-observability/current?topic=instana-filtering-dynamic-focus"
          >
            {t('in-settings:PermissionSection.infrastructureDfqMore')}
          </Link>
        </Typography>
      </StackItem>
      <StackItem>
        <FormGroup>
          <Label htmlFor="infra-dfq-filter">{t('in-settings:PermissionSection.infrastructureDfqHeader')}</Label>
          <InfraDfq infraDfqFilter={infraDfqFilter} update={updateInfraDfq} />
        </FormGroup>
      </StackItem>
      <StackItem>
        <Typography variant="heading-200" component="h4">
          {t('in-settings:productAreas.permissions', { context: area.header })}
        </Typography>
        {area.capabilities.map(productPermission => (
          <CheckboxFancy
            key={productPermission.key}
            size="large"
            className={locales.clickable}
            checked={permissionSet?.permissions.includes(productPermission.key) || false}
            onChange={() => updatePermission(productPermission.key)}
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
    <DfqSearchBar
      id="infra-dfq-filter"
      theme="light"
      onQueryValueChange={update}
      queryValue={infraDfqFilter}
      manageFiltersDisabled
    />
  );
}
