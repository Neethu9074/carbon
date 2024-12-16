/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapFormItems } from 'formalistic';
import { parse, stringify } from 'qs';
import React from 'react';

import { Stack, StackItem, Typography, Checkbox, Label } from '@instana/components';
import { PermissionSet, ScopeBinding } from '@instana/types';

import {
  AreaRole,
  AreaRoles,
  AreaRoleWithCustomType,
  automationAdditionalCapabilities,
  automationOwnerCapabilities,
  automationViewCapabilities,
  ProductArea,
  ScopedPermissionItem,
  ScopedPermissionType,
  ScopeRoles
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import {
  ConfigurationSummary,
  getConfigurationSummaryMsg
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/ConfigurationSummary';
import {
  getField,
  updateFormField,
  updatePermissionSetForLimitableProductArea
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import { FormControlProps } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import RoleFormGroup from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/RoleFormGroup';
import ComboBox, { hasMultipleValuesSelected, Options } from 'in-components/ComboBox/ComboBox';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { CapabilityType, productPermissionsObject } from 'in-stores/permission';
import { ACTION_TRANSLATIONS, ACTION_TYPES } from 'in-automation/constants';
import CreatableComboBox from 'in-components/ComboBox/CreatableComboBox';
import FormGroup from 'in-settings/components/FormGroup/FormGroup';
import useActionTags from 'in-automation/hooks/useActionTags';
import { t } from 'in-i18n';

import locals from './AutomationPanel.mless';

const typeOptions = ACTION_TYPES.map(type => ({
  value: type,
  label: ACTION_TRANSLATIONS[type]
}));

const mapToOption = (value: string) => ({ value, label: value });
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
  const entityPermissionKey = 'actionFilter';
  const actionFilterField = getField<ScopeBinding>(form, entityPermissionKey);

  const actionTags = useActionTags();
  const actionTagOptions = (actionTags.data ?? []).map(tag => ({ value: tag, label: tag }));
  const capabilities =
    role === 'OWNER' ? automationAdditionalCapabilities : role === 'VIEWER' ? automationViewCapabilities : [];

  const actionFilter = actionFilterField?.value?.scopeId ?? '';
  const { tags = [], type = [] } = parse(actionFilter, { comma: true }) as {
    tags?: string[] | string;
    type?: string[] | string;
  };
  const areaPermissions = capabilities.map(capability => productPermissionsObject[capability]);
  const updatePermissionSet = (permissionSet: PermissionSet) => {
    setForm(updateFormField(form, 'permissionSet', permissionSet, true));
  };
  const updateActionFilter = (actionFilter: ScopeBinding) => {
    setForm(updateFormField(form, entityPermissionKey, actionFilter, true));
  };
  const updatePermission = (value: string) => {
    if (!permissionSet) return;

    const hasToggledCapability = permissionSet.permissions.includes(value);
    const newPermissions = hasToggledCapability
      ? permissionSet.permissions.filter(permission => permission !== value)
      : [...permissionSet.permissions, value];

    updatePermissionSet({ ...permissionSet, permissions: newPermissions });
  };

  const updateTags = (tags: string[]) => {
    if (!permissionSet) return;
    const actionFilter = stringify({ tags, type }, { encode: false, arrayFormat: 'comma' });
    const scopeRoleId = role === 'OWNER' ? ScopeRoles.Owner : ScopeRoles.Viewer;
    const actionScope = { scopeId: actionFilter, scopeRoleId };
    updateActionFilter(actionScope);
  };

  const updateType = (type: string[]) => {
    if (!permissionSet) return;
    const actionFilter = stringify({ tags, type }, { encode: false, arrayFormat: 'comma' });
    const scopeRoleId = role === 'OWNER' ? ScopeRoles.Owner : ScopeRoles.Viewer;
    const actionScope = { scopeId: actionFilter, scopeRoleId };
    updateActionFilter(actionScope);
  };

  const onChangeRole = (selected: AreaRoleWithCustomType | undefined, limitation: ScopedPermissionType) => {
    if (!permissionSet || selected === 'CUSTOM') return;

    const restPermissionSet = updatePermissionSetForLimitableProductArea(
      permissionSet,
      productArea,
      limitation,
      selected
    );

    const permissions =
      selected === 'VIEWER'
        ? restPermissionSet.permissions.filter(
            permission => !automationOwnerCapabilities.includes(permission as CapabilityType)
          )
        : restPermissionSet.permissions;

    const scopeRoleId = selected === 'OWNER' ? ScopeRoles.Owner : ScopeRoles.Viewer;

    const newActionFilter = { ...restPermissionSet.actionFilter, scopeRoleId };
    const newPermissionSet: PermissionSet = {
      ...restPermissionSet,
      permissions,
      actionFilter: newActionFilter
    };

    let updatedForm = updateFormField(form, 'permissionSet', newPermissionSet, true);
    updatedForm = updateFormField(updatedForm, entityPermissionKey, newActionFilter, true);
    setForm(updatedForm);
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
                  </Stack>
                }
              />
            ))}
          </StackItem>
        </Stack>
      </ConfigurationSummary>
      {scopedPermissionItem === ScopedPermissionItem.LIMITED_ACCESS && (
        <Stack direction="vertical">
          <StackItem>
            <Typography variant="body-regular" component="div">
              {t('in-settings:PermissionSection.automationFilterUse')}
            </Typography>
          </StackItem>
          <StackItem>
            <FormGroup>
              <Label htmlFor="automation-action-type-filter">
                {t('in-settings:PermissionSection.automationActionTypeHeader')}
              </Label>
              <ComboBox
                id="automation-action-type-filter"
                isMulti
                options={typeOptions}
                value={type}
                onChange={types => {
                  if (!types) {
                    updateType([]);
                  } else if (hasMultipleValuesSelected(types)) {
                    updateType(types.map(option => option.value));
                  } else {
                    updateType([types.value]);
                  }
                }}
              />
              <TouchedMessages field={actionFilterField} />
            </FormGroup>
          </StackItem>
          <StackItem>
            <FormGroup>
              <Label htmlFor="automation-tag-filter">{t('in-settings:PermissionSection.automationTagHeader')}</Label>
              <CreatableComboBox
                id="automation-tag-filter"
                isMulti
                options={actionTagOptions}
                value={Array.isArray(tags) ? tags.map(mapToOption) : [tags].map(mapToOption)}
                onChange={(tags: Options) => {
                  if (!tags) {
                    updateTags([]);
                  } else if (hasMultipleValuesSelected(tags)) {
                    updateTags(tags.map(option => option.value));
                  }
                }}
              />
              <TouchedMessages field={actionFilterField} />
            </FormGroup>
          </StackItem>
        </Stack>
      )}
    </Stack>
  );
}
