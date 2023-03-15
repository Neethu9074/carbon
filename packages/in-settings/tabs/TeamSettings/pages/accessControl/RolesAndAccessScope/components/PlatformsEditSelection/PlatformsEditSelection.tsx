/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { PermissionSetWithRoles } from '@instana/types';
import { SvgIcon, Stack } from '@instana/components';

import {
  getField,
  getScopeFromProductArea,
  updateFormField,
  updatePermissionSetForLimitableProductArea
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import { LimitableProductArea, ProductArea, ScopedPermissionItem } from '../../constants';
import { SubSlideConfig } from 'in-settings/components/ConfigDialog/ConfigDialog';
import Section from 'in-settings/tabs/TeamSettings/pages/accessControl/Section';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import { SlideControlProps } from 'in-settings/hooks/useSubSlideControl';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './PlatformsEditSelection.mless';

/**
 * Properties for the platforms edit component
 * @property title of the plat form area
 * @property icon reference to be icon, that should be displayed
 */
export interface PlatformsEditSelectionProps extends SlideControlProps<SubSlideConfig>, FormControlProps {}

const generalAreas: Array<LimitableProductArea> = [
  ProductArea.PCF,
  ProductArea.PHMC,
  ProductArea.ZHMC,
  ProductArea.OPENSTACK,
  ProductArea.VSPHERE
];

/**
 * Provides a component that allows to edit the platform access for a group
 * @param param see PlatformsEditSelectionProps
 * @returns component
 */
export default function _PlatformsEditSelection({ form, setForm }: PlatformsEditSelectionProps) {
  const permissionSetField = getField<PermissionSetWithRoles>(form, 'permissionSet');
  const permissionSet = permissionSetField?.value;

  // Updates the permissionSet, by removing the value from the permissions array or adding it
  const onUpdatePermissionSet = (value: LimitableProductArea, isAdd: boolean) => {
    if (!permissionSet?.permissions) return;
    const newPermissionSet = updatePermissionSetForLimitableProductArea(
      permissionSet,
      value,
      isAdd ? ScopedPermissionItem.ACCESS_ALL : ScopedPermissionItem.NO_ACCESS
    );
    setForm(updateFormField(form, 'permissionSet', newPermissionSet, true));
  };

  // Checks whether it currently has the permission
  const hasAnyAreaPermission = (area: LimitableProductArea) => {
    const access = permissionSet ? getScopeFromProductArea(area, permissionSet) : ScopedPermissionItem.NO_ACCESS;
    return access === ScopedPermissionItem.ACCESS_ALL ? true : false;
  };

  return (
    <Section icon="lib_platforms" title={t('in-settings:PermissionSection.title_platforms')} panelNoIndentation>
      <div className={locals.sectionContent}>
        {generalAreas.map(area => {
          const platformTitle = t('in-settings:productAreas.permissions', { context: area });
          return (
            <>
              <CheckboxFancy
                size="large"
                checked={hasAnyAreaPermission(area)}
                onChange={(event: any) => onUpdatePermissionSet(area, event.target.checked)}
                label={
                  <Stack gap="xsmall" direction="horizontal" align="start">
                    <span>{platformTitle}</span>
                    <Tooltip
                      content={t('in-settings:tabs.permitsAccessToLabelMonitoringFunctionality', {
                        label: platformTitle
                      })}
                      align="rightMiddle"
                    >
                      <SvgIcon type="lib_help_error_info_outline" size="s" color={'#172429'} />
                    </Tooltip>
                  </Stack>
                }
              />
            </>
          );
        })}
      </div>
    </Section>
  );
}
