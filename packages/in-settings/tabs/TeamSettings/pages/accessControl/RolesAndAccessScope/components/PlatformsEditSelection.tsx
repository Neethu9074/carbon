/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

// @ts-ignore
import { Toggle } from '@instana/components';
import { PermissionSetWithRoles } from '@instana/types';

import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import { getField, updateFormField } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import { ProductAreaType } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import RbacSection from 'in-settings/tabs/TeamSettings/pages/accessControl/Section';
import { SubSlideConfig } from 'in-settings/components/ConfigDialog/ConfigDialog';
import { AreaPermissionType, AreaPermission } from 'in-stores/permission';
import { SlideControlProps } from 'in-settings/hooks/useSubSlideControl';
import Sections from 'in-components/workspace/Sections/Sections';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

export interface PlatformsEditSelectionProps extends SlideControlProps<SubSlideConfig>, FormControlProps {
  title: string;
  productArea: ProductAreaType;
  icon: string;
}

interface PlatformArea {
  id: AreaPermissionType;
  title: string;
  icon: string;
  advanced?: boolean;
}

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
    icon: 'lib_kubernetes',
    advanced: true
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

export default function _PlatformsEditSelection({ title, icon, form, setForm }: PlatformsEditSelectionProps) {
  const permissionSetField = getField<PermissionSetWithRoles>(form, 'permissionSet');
  const permissionSet = permissionSetField?.value;

  const onUpdatePermissionSet = (form: any, setForm: any, value: string, isAdd: boolean) => {
    if (!permissionSet?.permissions) return;
    const permissions = isAdd
      ? [...permissionSet.permissions, value]
      : permissionSet.permissions.filter(permission => permission !== value);
    const newPermissionSet = { ...permissionSet, permissions };
    setForm(updateFormField(form, 'permissionSet', newPermissionSet, true));
  };

  return (
    <RbacSection icon={icon} title={title}>
      <Sections>
        {platformAreas.map(area => {
          const toggleId = `${area.id}-toggle`;
          return (
            <Section titleHtmlFor={toggleId} title={area.title} icon={area.icon}>
              <Toggle
                id={toggleId}
                checked={permissionSet?.permissions.includes(area.id) || false}
                onChange={event => onUpdatePermissionSet(form, setForm, area.id, event.target.checked)}
              />
            </Section>
          );
        })}
      </Sections>
    </RbacSection>
  );
}
