/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { PermissionSetWithRoles } from '@instana/types';
import { Toggle } from '@instana/components';

import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import { getField, updateFormField } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import RbacSection from 'in-settings/tabs/TeamSettings/pages/accessControl/Section';
import { SubSlideConfig } from 'in-settings/components/ConfigDialog/ConfigDialog';
import { AreaPermissionType, AreaPermission } from 'in-stores/permission';
import { SlideControlProps } from 'in-settings/hooks/useSubSlideControl';
import Sections from 'in-components/workspace/Sections/Sections';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

/**
 * Properties for the platforms edit component
 * @property title of the plat form area
 * @property icon reference to be icon, that should be displayed
 */
export interface PlatformsEditSelectionProps extends SlideControlProps<SubSlideConfig>, FormControlProps {
  title: string;
  icon: string;
}

/**
 * Model for each platform area (e.g. K8S CF..)
 * @property id of the current area
 * @property title translated title of the current area
 * @property icon reference to the corresponding area
 */
interface PlatformArea {
  id: AreaPermissionType;
  title: string;
  icon: string;
}

// Definition of all PlatformAreas
const platformAreas: Array<PlatformArea> = [
  {
    id: AreaPermission.ACCESS_PCF,
    title: t('in-settings:productAreas.permissions', { context: 'PCF' }),
    icon: 'lib_cloudfoundry'
  },
  {
    id: AreaPermission.ACCESS_PHMC,
    title: t('in-settings:productAreas.permissions', { context: 'PHMC' }),
    icon: 'lib_phmc_console'
  },
  {
    id: AreaPermission.ACCESS_ZHMC,
    title: t('in-settings:productAreas.permissions', { context: 'ZHMC' }),
    icon: 'lib_zhmcConsole'
  },
  {
    id: AreaPermission.ACCESS_KUBERNETES,
    title: t('in-settings:productAreas.permissions', { context: 'KUBERNETES' }),
    icon: 'lib_kubernetes'
  },
  {
    id: AreaPermission.ACCESS_OPENSTACK,
    title: t('in-settings:productAreas.permissions', { context: 'OPENSTACK' }),
    icon: 'lib_openstack'
  },
  {
    id: AreaPermission.ACCESS_VSPHERE,
    title: t('in-settings:productAreas.permissions', { context: 'VSPHERE' }),
    icon: 'lib_vsphere'
  }
];

/**
 * Provides a component that allows to edit the platform access for a group
 * @param param see PlatformsEditSelectionProps
 * @returns component
 */
export default function _PlatformsEditSelection({ title, icon, form, setForm }: PlatformsEditSelectionProps) {
  const permissionSetField = getField<PermissionSetWithRoles>(form, 'permissionSet');
  const permissionSet = permissionSetField?.value;

  // Updates the permissionSet, by removing the value from the permissions array or adding it
  const onUpdatePermissionSet = (value: string, isAdd: boolean) => {
    if (!permissionSet?.permissions) return;
    const permissions = isAdd
      ? [...permissionSet.permissions, value]
      : permissionSet.permissions.filter(permission => permission !== value);
    const newPermissionSet = { ...permissionSet, permissions };
    setForm(updateFormField(form, 'permissionSet', newPermissionSet, true));
  };

  // Checks whether it currently has the permission
  const hasAnyAreaPermission = (areaId: string) => permissionSet?.permissions.includes(areaId) || false;

  return (
    <RbacSection icon={icon} title={title} panelNoIndentation>
      <Sections>
        {platformAreas.map(area => {
          const toggleId = `${area.id}-toggle`; // id for the toggle element
          return (
            <Section titleHtmlFor={toggleId} title={area.title} icon={area.icon}>
              <Toggle
                id={toggleId}
                checked={hasAnyAreaPermission(area.id)}
                onChange={event => onUpdatePermissionSet(area.id, event.target.checked)}
              />
            </Section>
          );
        })}
      </Sections>
    </RbacSection>
  );
}
