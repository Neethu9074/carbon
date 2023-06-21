/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapFormItems } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import { SvgIcon, Typography, Stack, Spacer } from '@instana/components';
import { PermissionSetWithRoles } from '@instana/types';

import {
  ProductArea,
  ProductAreaType,
  ProductAreaPermissionMap
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import { getField, updateFormField } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import { productPermissionsObject, LimitedAccessScope } from 'in-stores/permission';
import { SubSlideConfig } from 'in-settings/components/ConfigDialog/ConfigDialog';
import Section from 'in-settings/tabs/TeamSettings/pages/accessControl/Section';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import { SlideControlProps } from 'in-settings/hooks/useSubSlideControl';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './PermissionSelection.mless';

export interface PermissionSelectionProps<FORM_TYPE extends MapFormItems>
  extends SlideControlProps<SubSlideConfig>,
    FormControlProps<FORM_TYPE> {
  title: string;
  description?: string;
  productAreas: Array<ProductAreaType>;
  icon: string;
}

export default function PermissionSelection<FORM_TYPE extends MapFormItems>({
  title,
  description = '',
  productAreas,
  icon,
  form,
  setForm
}: PermissionSelectionProps<FORM_TYPE>) {
  const permissionSetField = getField<PermissionSetWithRoles>(form, 'permissionSet');
  const permissionSet = permissionSetField?.value;
  const productAreaCapabilities = productAreas.map(productArea => ({
    header: productArea,
    capabilities: ProductAreaPermissionMap[productArea].capabilities
  }));

  const onUpdatePermissionSet = (form: any, setForm: any, value: string) => {
    if (!permissionSet) return;

    const hasToggledCapability = permissionSet.permissions.includes(value);
    let newPermissions = hasToggledCapability
      ? permissionSet.permissions.filter(permission => permission !== value)
      : [...permissionSet.permissions, value];

    // SYNTHETICS workaround as long it is not a own 'section' with proper limitation functionality
    // for now this hides SYNTHETICS area if no permission to the area is granted and gives access vice versa
    const { capabilities } = ProductAreaPermissionMap[ProductArea.SYNTHETICS];
    const hasAnySyntheticsPermission = capabilities ? capabilities.some(cap => newPermissions.includes(cap)) : false;
    if (hasAnySyntheticsPermission && newPermissions.includes(LimitedAccessScope.LIMITED_SYNTHETICS_SCOPE)) {
      newPermissions = newPermissions.filter(perm => perm !== LimitedAccessScope.LIMITED_SYNTHETICS_SCOPE);
    } else if (!hasAnySyntheticsPermission && !newPermissions.includes(LimitedAccessScope.LIMITED_SYNTHETICS_SCOPE)) {
      newPermissions.push(LimitedAccessScope.LIMITED_SYNTHETICS_SCOPE);
    }

    const newPermissionSet = { ...permissionSet, permissions: newPermissions };

    setForm(updateFormField(form, 'permissionSet', newPermissionSet, true));
  };

  return (
    <Section icon={icon} title={title}>
      {description && (
        <Typography variant="body-regular" component="p">
          {description}
        </Typography>
      )}
      {productAreaCapabilities.map((area, index) => (
        <div key={area.header}>
          <Typography variant="heading-200" component="h4">
            {t('in-settings:productAreas.permissions', { context: area.header })}
          </Typography>
          {area.capabilities
            .map(capability => productPermissionsObject[capability])
            .map(productPermission => (
              <CheckboxFancy
                key={productPermission.keyForGroupApi}
                className={classNames({ [locals.clickable]: true })}
                size="large"
                checked={permissionSet?.permissions.includes(productPermission.keyForGroupApi) || false}
                onChange={() => onUpdatePermissionSet(form, setForm, productPermission.keyForGroupApi)}
                label={
                  <Stack gap="xsmall" direction="horizontal" align="start">
                    <span className={classNames({ [locals.clickable]: true })}>{productPermission.label}</span>
                    <Tooltip content={productPermission.description} align="rightMiddle">
                      {productPermission.isOwnerPermission ? (
                        <SvgIcon type="lib_help_error_warning_outline" size="s" color={'#172429'} />
                      ) : (
                        <SvgIcon type="lib_help_error_info_outline" size="s" color={'#172429'} />
                      )}
                    </Tooltip>
                  </Stack>
                }
              />
            ))}
          {index < productAreaCapabilities.length - 1 && <Spacer vertical="normal" />}
        </div>
      ))}
    </Section>
  );
}
