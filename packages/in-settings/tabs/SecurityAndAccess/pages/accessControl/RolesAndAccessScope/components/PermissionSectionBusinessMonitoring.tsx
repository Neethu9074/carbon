/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapFormItems } from 'formalistic';
import React from 'react';

import { SvgIcon, Typography } from '@instana/components';
import { PermissionSet } from '@instana/types';

import BusinessMonitoringPanel from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/Panels/BusinessMonitoringPanels/BusinessMonitoringPanel';
import {
  getField,
  updateFormField,
  updatePermissionSetForLimitableProductArea
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import TabSelect, {
  TabSelectHeader,
  TabSelectItem,
  TabSelectMenu,
  TabSelectPanel,
  TabSelectPanels
} from 'in-components/TabSelect';
import { FormControlProps } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import { LimitableProductArea } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { SubSlideConfig } from 'in-settings/components/ConfigDialog/ConfigDialog';
import { SlideControlProps } from 'in-settings/hooks/useSubSlideControl';
import { t } from 'in-i18n';

export interface PermissionSectionBusinessMonitoringProps<FORM_TYPE extends MapFormItems>
  extends SlideControlProps<SubSlideConfig>,
    FormControlProps<FORM_TYPE> {
  title: string;
  accessAllTitle: string;
  accessAllDescription: string;
  noAccessTitle: string;
  noAccessDescription: string;
  productArea: LimitableProductArea;
  icon: string;
  setValid?: (isValid: boolean) => void;
  editMode?: boolean;
}

export default function PermissionSectionBusinessMonitoring<FORM_TYPE extends MapFormItems>({
  title,
  accessAllTitle,
  accessAllDescription,
  noAccessTitle,
  noAccessDescription,
  productArea,
  icon,
  form,
  setForm
}: PermissionSectionBusinessMonitoringProps<FORM_TYPE>) {
  const ScopedPermissionItem = Object.freeze({
    ACCESS_ALL: 'ACCESS_ALL',
    NO_ACCESS: 'NO_ACCESS'
  } as const);
  type ScopedPermissionType = keyof typeof ScopedPermissionItem;
  const ScopedPermissionItems = Object.freeze(Object.values(ScopedPermissionItem)) as Array<ScopedPermissionType>;

  function getScopeFromProductArea(permissionSet: PermissionSet): ScopedPermissionType {
    const { permissions } = permissionSet;
    const hasAreaPermission = !permissions.includes('LIMITED_BIZOPS_SCOPE');

    if (hasAreaPermission) return ScopedPermissionItem.ACCESS_ALL;
    return ScopedPermissionItem.NO_ACCESS;
  }

  const defaultLimitation = ScopedPermissionItem.ACCESS_ALL;
  const permissionSetField = getField<PermissionSet>(form, 'permissionSet');
  const permissionSet = permissionSetField?.value;
  const limitedPermission = permissionSet ? getScopeFromProductArea(permissionSet) : defaultLimitation;

  const onUpdatePermissionSet = (limitation: ScopedPermissionType) => {
    if (!permissionSet) return;
    const { ...restPermissionSet } = updatePermissionSetForLimitableProductArea(
      permissionSet,
      productArea,
      limitation,
      undefined
    );
    const newPermissionSet = {
      ...restPermissionSet
    };
    setForm(updateFormField(form, 'permissionSet', newPermissionSet, true));
  };

  return (
    <TabSelect
      activePanelId={limitedPermission}
      onChange={panelId => onUpdatePermissionSet(panelId ?? defaultLimitation)}
    >
      <TabSelectHeader>
        <SvgIcon type={icon} size="l" />
        <Typography variant="heading-200" component="h3" noMargin>
          {title}
        </Typography>
      </TabSelectHeader>
      <TabSelectMenu>
        {ScopedPermissionItems.map(context => (
          <TabSelectItem key={context} forId={context} withRadioButton>
            {t('in-settings:permissionScope.selection', { context: context.toLowerCase() })}
          </TabSelectItem>
        ))}
      </TabSelectMenu>
      <TabSelectPanels>
        {ScopedPermissionItems.map(context => (
          <TabSelectPanel key={context} id={context}>
            {context === ScopedPermissionItem.ACCESS_ALL && (
              <BusinessMonitoringPanel title={accessAllTitle} description={accessAllDescription} />
            )}
            {context === ScopedPermissionItem.NO_ACCESS && (
              <BusinessMonitoringPanel title={noAccessTitle} description={noAccessDescription} />
            )}
          </TabSelectPanel>
        ))}
      </TabSelectPanels>
    </TabSelect>
  );
}
