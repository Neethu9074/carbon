/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapFormItems } from 'formalistic';
import React, { useState } from 'react';

import { SvgIcon, Stack, StackItem, Typography, Spacer } from '@instana/components';
import { PermissionSet } from '@instana/types';
import { Link } from '@instana/components';
import { Toggle } from '@instana/legacy';

import {
  ConfigurationSummary,
  getConfigurationSummaryMsg
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/ConfigurationSummary';
import {
  AreaRole,
  ScopedPermissionItem,
  ProductArea,
  ScopedPermissionType
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import {
  getField,
  updateFormField,
  updatePermissionSetForLimitableProductArea
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
//@ts-ignore
import DfqSearchBar from 'in-components/SearchBar/DfqSearchBar';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import { getInfrastructurePermissions } from 'in-stores/permission';
import FormGroup from 'in-settings/components/FormGroup';
import Label from 'in-components/form/Label';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './InfrastructureAccessPanel.mless';

interface InfrastructureAccessPanelProps<FORM_TYPE extends MapFormItems> extends FormControlProps<FORM_TYPE> {
  scopedPermissionItem: ScopedPermissionType;
}

export default function InfrastructureAccessPanel<FORM_TYPE extends MapFormItems>({
  form,
  setForm,
  scopedPermissionItem
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

  const [isDfqVisible, setIsDfqVisible] = useState(infraDfqFilter ? true : false);

  const updatePermissionSet = (permissionSet: PermissionSet) => {
    setForm(updateFormField(form, 'permissionSet', permissionSet, true));
  };

  const updateInfraDfq = (infraDfq: string) => {
    if (!permissionSet) return;
    const restPermissionSet = updatePermissionSetForLimitableProductArea(
      permissionSet,
      productArea,
      scopedPermissionItem
    );
    const infraScope = { scopeId: infraDfq ? infraDfq : undefined, scopeRoleId: '-1' };
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
    scopedPermissionItem,
    AreaRole.VIEWER
  );
  const InfrastructurePermissionsSection = () => {
    return (
      <StackItem>
        {area.capabilities.map(productPermission => (
          <CheckboxFancy
            key={productPermission.key}
            size="large"
            className={locals.clickable}
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
    );
  };
  const InfrastructureFilterSection = () => {
    return (
      <>
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
        <HorizontalFlexWrapper>
          <Toggle
            checked={isDfqVisible}
            onChange={e => {
              setIsDfqVisible(e.target.checked);
              const infraScope = { scopeId: e.target.checked ? undefined : '', scopeRoleId: '-1' };
              updatePermissionSet({ ...(permissionSet as PermissionSet), [entityPermissionKey]: infraScope });
            }}
          />
          <Spacer horizontal="xxsmall" />
          <Label className={locals.dfqToggleLabel}>
            {t('in-settings:PermissionSection.infrastructureDfqToggleLabel')}
          </Label>
        </HorizontalFlexWrapper>
        {isDfqVisible && (
          <StackItem>
            <FormGroup>
              <Label htmlFor="infra-dfq-filter">{t('in-settings:PermissionSection.infrastructureDfqHeader')}</Label>
              <InfraDfq infraDfqFilter={infraDfqFilter} update={updateInfraDfq} />
              <TouchedMessages field={permissionSetField} />
            </FormGroup>
          </StackItem>
        )}
      </>
    );
  };
  return (
    <Stack direction="vertical">
      <ConfigurationSummary accessLevelType={scopedPermissionItem} accessLevelMsg={accessLevelMessage}>
        <Stack>
          <StackItem>
            <Typography variant="body-regular" component="div">
              {rolePermissionMessage}
            </Typography>
          </StackItem>
          <InfrastructurePermissionsSection />
        </Stack>
      </ConfigurationSummary>
      {scopedPermissionItem === ScopedPermissionItem.LIMITED_ACCESS && <InfrastructureFilterSection />}
    </Stack>
  );
}

export interface InfraDfqProps {
  infraDfqFilter: string;
  update: any;
}

export function InfraDfq({ infraDfqFilter, update }: InfraDfqProps) {
  return <DfqSearchBar theme="light" onQueryValueChange={update} queryValue={infraDfqFilter} manageFiltersDisabled />;
}
