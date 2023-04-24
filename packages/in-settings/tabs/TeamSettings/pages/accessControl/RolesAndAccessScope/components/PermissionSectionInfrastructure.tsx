/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SvgIcon, Typography } from '@instana/components';
import { PermissionSetWithRoles } from '@instana/types';
import { MapFormItems } from 'formalistic';

import {
  getAreaRoleFromPermissionSet,
  getField,
  getScopeFromProductArea,
  updateFormField,
  updatePermissionSetForLimitableProductArea
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import {
  AreaRoleWithCustomType,
  ProductArea,
  ScopedPermissionItem,
  ScopedPermissionType
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import InfrastructureAccessPanel from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/Panels/InfrastructureAccessPanel';
import TabSelect, {
  TabSelectHeader,
  TabSelectItem,
  TabSelectMenu,
  TabSelectPanel,
  TabSelectPanels
} from 'in-components/TabSelect';
import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import NoAccessPanel from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/Panels/NoAccessPanel';
import { SubSlideConfig } from 'in-settings/components/ConfigDialog/ConfigDialog';
import { SlideControlProps } from 'in-settings/hooks/useSubSlideControl';
import { AreaPermission } from 'in-stores/permission';
import { t } from 'in-i18n';

export type EntityPermissionKey = 'infraDfqFilter';
const VIEWER_ACCESS = 'VIEWER_ACCESS';

export interface PermissionSectionInfrastructureProps<FORM_TYPE extends MapFormItems>
  extends SlideControlProps<SubSlideConfig>,
    FormControlProps<FORM_TYPE> {
  title: string;
  viewerAccessDescription: string;
  icon: string;
}

export default function PermissionSectionInfrastructure<FORM_TYPE extends MapFormItems>({
  title,
  viewerAccessDescription,
  icon,
  form,
  setForm
}: PermissionSectionInfrastructureProps<FORM_TYPE>) {
  const productArea = ProductArea.INFRASTRUCTURE;
  const entityPermissionKey = 'infraDfqFilter';

  const permissionSetField = getField<PermissionSetWithRoles>(form, 'permissionSet');
  const permissionSet = permissionSetField?.value;
  const role = getAreaRoleFromPermissionSet(productArea, permissionSet); // yet unused

  const limitedPermission = permissionSet
    ? getScopeFromProductArea(productArea, permissionSet) === ScopedPermissionItem.NO_ACCESS
      ? ScopedPermissionItem.NO_ACCESS
      : VIEWER_ACCESS
    : VIEWER_ACCESS;

  const onUpdatePermissionSet = (
    role: AreaRoleWithCustomType | undefined,
    limitation: ScopedPermissionType | typeof VIEWER_ACCESS
  ) => {
    if (!permissionSet || role === 'CUSTOM') return;

    // because of reusing update for not existing VIEWER_ACCESS in combination with DFQ
    // this converts into LIMITED_ACCESS if a DFQ is inserted or ACCESS_ALL otherwise
    if (limitation === VIEWER_ACCESS) {
      const hasEmptyDfq = !!permissionSet.infraDfqFilter?.scopeId;
      limitation = hasEmptyDfq ? ScopedPermissionItem.ACCESS_ALL : ScopedPermissionItem.LIMITED_ACCESS;
    }
    const { [entityPermissionKey]: infraFilter, ...restPermissionSet } = updatePermissionSetForLimitableProductArea(
      permissionSet,
      productArea,
      limitation,
      role
    );

    // ACCESS_INFRASTRUCTURE_ANALYZE is implicitely removed if NO_ACCESS to ACCESS_INFRASTRUCTURE is set
    const newPermissions =
      limitation === ScopedPermissionItem.NO_ACCESS
        ? restPermissionSet.permissions.filter(
            permission => AreaPermission.ACCESS_INFRASTRUCTURE_ANALYZE !== permission
          )
        : restPermissionSet.permissions;
    // infraDfqFilter is cleared in case limitation not set to LIMITED_ACCESS
    const newInfraFilter =
      limitation === ScopedPermissionItem.LIMITED_ACCESS ? infraFilter : { scopeId: '', scopeRoleId: '-600' };
    const newPermissionSet = {
      ...restPermissionSet,
      permissions: newPermissions,
      [entityPermissionKey]: newInfraFilter
    };

    setForm(updateFormField(form, 'permissionSet', newPermissionSet, true));
  };

  return (
    <TabSelect<ScopedPermissionType>
      initialActivePanelId={limitedPermission}
      onChange={(_panelId, value) => onUpdatePermissionSet(role, value ?? VIEWER_ACCESS)}
    >
      <TabSelectHeader>
        <SvgIcon type={icon} size="l" />
        <Typography variant="heading-200" component="h3" noMargin>
          {title}
        </Typography>
      </TabSelectHeader>
      <TabSelectMenu>
        <TabSelectItem key="VIEWER_ACCESS" forId="VIEWER_ACCESS" value="VIEWER_ACCESS" withRadioButton>
          {t('in-settings:permissionScope.selection', { context: 'viewer_access' })}
        </TabSelectItem>
        <TabSelectItem key="NO_ACCESS" forId="NO_ACCESS" value="NO_ACCESS" withRadioButton>
          {t('in-settings:permissionScope.selection', { context: ScopedPermissionItem.NO_ACCESS.toLowerCase() })}
        </TabSelectItem>
      </TabSelectMenu>
      <TabSelectPanels>
        <TabSelectPanel key="VIEWER_ACCESS" id="VIEWER_ACCESS">
          <InfrastructureAccessPanel description={viewerAccessDescription} role={role} form={form} setForm={setForm} />
        </TabSelectPanel>
        <TabSelectPanel key="NO_ACCESS" id="NO_ACCESS">
          <NoAccessPanel />
        </TabSelectPanel>
      </TabSelectPanels>
    </TabSelect>
  );
}
