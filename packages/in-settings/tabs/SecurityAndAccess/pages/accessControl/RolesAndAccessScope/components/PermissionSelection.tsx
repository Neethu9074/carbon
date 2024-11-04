/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapFormItems } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import { SvgIcon, Typography, Stack, Spacer, StackItem, Checkbox } from '@instana/components';
import { PermissionSet } from '@instana/types';

import {
  ProductAreaType,
  ProductAreaPermissionMap
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { FormControlProps } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import {
  getField,
  updateFormField
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import { CapabilityType, PermissionsUnion, productPermissionsObject } from 'in-stores/permission';
import Section from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Section';
import ScrollStep from 'in-components/StepsContainer/ScrollStep';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './PermissionSelection.mless';

interface ProductAreaCapabilities {
  header: ProductAreaType;
  capabilities: PermissionsUnion[] | undefined;
}

export interface PermissionSelectionProps<FORM_TYPE extends MapFormItems> extends FormControlProps<FORM_TYPE> {
  title: string;
  description?: string;
  productAreas: Array<ProductAreaType>;
  icon: string;
  hasAdditionalCapabilities?: boolean;
}

export default function PermissionSelection<FORM_TYPE extends MapFormItems>({
  title,
  description = '',
  productAreas,
  icon,
  form,
  setForm,
  hasAdditionalCapabilities
}: PermissionSelectionProps<FORM_TYPE>) {
  const permissionSetField = getField<PermissionSet>(form, 'permissionSet');
  const permissionSet = permissionSetField?.value;
  const productAreaCapabilities: ProductAreaCapabilities[] = productAreas.map(productArea => ({
    header: productArea,
    capabilities: hasAdditionalCapabilities
      ? ProductAreaPermissionMap[productArea].additionalCapabilities
      : ProductAreaPermissionMap[productArea].capabilities
  }));

  const onUpdatePermissionSet = (form: any, setForm: any, value: string) => {
    if (!permissionSet) return;

    const hasToggledCapability = permissionSet.permissions.includes(value);
    const newPermissions = hasToggledCapability
      ? permissionSet.permissions.filter(permission => permission !== value)
      : [...permissionSet.permissions, value];

    const newPermissionSet = { ...permissionSet, permissions: newPermissions };

    setForm(updateFormField(form, 'permissionSet', newPermissionSet, true));
  };

  const permissionSelectionContent = (area: ProductAreaCapabilities, index: number) => (
    <>
      {(area.capabilities as CapabilityType[])
        ?.map(capability => productPermissionsObject[capability])
        .map(productPermission => (
          <Checkbox
            key={productPermission.keyForGroupApi}
            className={classNames({ [locals.clickable]: true })}
            size="large"
            checked={permissionSet?.permissions.includes(productPermission.keyForGroupApi) || false}
            onChange={() => onUpdatePermissionSet(form, setForm, productPermission.keyForGroupApi)}
            label={
              <Stack gap="xsmall" direction="horizontal" align="start">
                <span className={classNames({ [locals.clickable]: true })}>{productPermission.label}</span>
                {productPermission.description && (
                  <Tooltip content={productPermission.description} align="auto">
                    {productPermission.isOwnerPermission ? (
                      <SvgIcon type="lib_help_error_warning_outline" size="s" color={'#172429'} />
                    ) : (
                      <SvgIcon type="lib_help_error_info_outline" size="s" color={'#172429'} />
                    )}
                  </Tooltip>
                )}
              </Stack>
            }
          />
        ))}
      {!hasAdditionalCapabilities && index < productAreaCapabilities.length - 1 && <Spacer vertical="normal" />}
    </>
  );

  return (
    <>
      {hasAdditionalCapabilities ? (
        productAreaCapabilities[0].capabilities && (
          <StackItem>
            <Typography variant="heading-200" component="h2">
              {t('in-settings:productAreas.additionalPermissions')}
            </Typography>
            {productAreaCapabilities.map((area, index) => (
              <div key={area.header}>{permissionSelectionContent(area, index)}</div>
            ))}
          </StackItem>
        )
      ) : (
        <Section icon={icon} title={title}>
          {description && (
            <Typography variant="body-regular" component="p">
              {description}
            </Typography>
          )}
          {productAreaCapabilities.map((area, index) => (
            <ScrollStep id={area.header} key={`${index} - ${area.header}`}>
              <div key={area.header}>
                <Typography variant="heading-200" component="h4">
                  {t('in-settings:productAreas.permissions', { context: area.header })}
                </Typography>
                {permissionSelectionContent(area, index)}
              </div>
            </ScrollStep>
          ))}
        </Section>
      )}
    </>
  );
}
