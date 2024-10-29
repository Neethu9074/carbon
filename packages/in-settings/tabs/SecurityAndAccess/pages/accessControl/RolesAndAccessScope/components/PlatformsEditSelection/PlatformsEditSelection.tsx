/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapFormItems } from 'formalistic';
import React from 'react';

import { SvgIcon, Stack, Checkbox } from '@instana/components';
import { PermissionSet } from '@instana/types';

import {
  getField,
  getScopeFromProductArea,
  updateFormField,
  updatePermissionSetForLimitableProductArea
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import {
  LimitableProductArea,
  ProductArea,
  ScopedPermissionItem,
  ScopedPermissionType
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import {
  hasKubernetesAccess,
  hasOpenStackAccess,
  hasPCFAccess,
  hasPHMCAccess,
  hasPowerVcAccess,
  hasSAPAccess,
  hasVSphereAccess,
  hasZHMCAccess
} from 'in-stores/permission';
import KubernetesEditSection from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/PlatformsEditSelection/KubernetesEditSection';
import { FormControlProps } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import Section from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Section';
import { SubSlideConfig } from 'in-settings/components/ConfigDialog/ConfigDialog';
import { SlideControlProps } from 'in-settings/hooks/useSubSlideControl';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './PlatformsEditSelection.mless';

/**
 * Properties for the platforms edit component
 */
export interface PlatformsEditSelectionProps<FORM_TYPE extends MapFormItems>
  extends SlideControlProps<SubSlideConfig>,
    FormControlProps<FORM_TYPE> {}

const generalAreas: Array<LimitableProductArea> = [
  ...(hasPCFAccess ? [ProductArea.PCF] : []),
  ...(hasPHMCAccess ? [ProductArea.PHMC] : []),
  ...(hasPowerVcAccess ? [ProductArea.POWERVC] : []),
  ...(hasZHMCAccess ? [ProductArea.ZHMC] : []),
  ...(hasOpenStackAccess ? [ProductArea.OPENSTACK] : []),
  ...(hasVSphereAccess ? [ProductArea.VSPHERE] : []),
  ...(hasSAPAccess ? [ProductArea.SAP] : [])
];

/**
 * Provides a component that allows to edit the platform access for a group
 * @param param see PlatformsEditSelectionProps
 * @returns component
 */
export default function _PlatformsEditSelection<FORM_TYPE extends MapFormItems>({
  form,
  setForm,
  setShowSubSlide,
  setSubSlideConfig
}: PlatformsEditSelectionProps<FORM_TYPE>) {
  const permissionSetField = getField<PermissionSet>(form, 'permissionSet');
  const permissionSet: PermissionSet | undefined = permissionSetField?.value;

  /**
   * Updates the permissionSet, by removing the value from the permissions array or adding it
   * @param area to be added / removed
   * @param newScope new scope to be set
   */
  const onUpdatePermissionSet = (area: LimitableProductArea, newScope: ScopedPermissionType) => {
    if (!permissionSet?.permissions) return;
    const newPermissionSet = updatePermissionSetForLimitableProductArea(permissionSet, area, newScope);
    setForm(updateFormField(form, 'permissionSet', newPermissionSet, true));
  };

  /**
   * Adds / Removes the access to a genralArea
   * @param area to be added / removed
   * @param isAdd whether it is an add case or remove case
   */
  const onUpdateGeneralArea = (area: LimitableProductArea, isAdd: boolean) => {
    onUpdatePermissionSet(area, isAdd ? ScopedPermissionItem.ACCESS_ALL : ScopedPermissionItem.NO_ACCESS);
  };

  // Checks whether it currently has the permission
  const hasAnyAreaPermission = (area: LimitableProductArea) => {
    const access = permissionSet ? getScopeFromProductArea(area, permissionSet) : ScopedPermissionItem.NO_ACCESS;
    return access === ScopedPermissionItem.ACCESS_ALL ? true : false;
  };

  // requires as soon as generalAreas is constructed based on ff / permissions - render only K8S (complete area will only be rendered if a platform is available)
  if (generalAreas.length === 0) {
    return (
      <KubernetesEditSection
        form={form}
        setForm={setForm}
        setSubSlideConfig={setSubSlideConfig}
        setShowSubSlide={setShowSubSlide}
      />
    );
  }
  // standard case
  return (
    <Section icon="lib_platforms" title={t('in-settings:productAreas.title_platforms')} panelNoIndentation>
      <div className={locals.sectionContent}>
        {generalAreas.map(area => {
          const platformTitle = t('in-settings:productAreas.permissions', { context: area });
          return (
            <Checkbox
              key={platformTitle}
              size="large"
              checked={hasAnyAreaPermission(area)}
              onChange={(event: any) => onUpdateGeneralArea(area, event.target.checked)}
              className={locals.clickable}
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
          );
        })}
      </div>
      {hasKubernetesAccess && (
        <KubernetesEditSection
          form={form}
          isChild
          setForm={setForm}
          setSubSlideConfig={setSubSlideConfig}
          setShowSubSlide={setShowSubSlide}
        />
      )}
    </Section>
  );
}
