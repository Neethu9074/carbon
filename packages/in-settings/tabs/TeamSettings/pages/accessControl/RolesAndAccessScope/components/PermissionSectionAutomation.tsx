/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapFormItems } from 'formalistic';
import React from 'react';

import { SvgIcon, Typography } from '@instana/components';
import { PermissionSet } from 'in-types';

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
import { t } from 'in-i18n';
import AutomationAccessPanel from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/Panels/AutomationPanel/AutomationPanel';

export interface PermissionSectionAutomationProps<FORM_TYPE extends MapFormItems>
  extends SlideControlProps<SubSlideConfig>,
    FormControlProps<FORM_TYPE> {
  icon: string;
  title: string;
}

export default function PermissionSectionAutomation<FORM_TYPE extends MapFormItems>({
  title,
  icon,
  form,
  setForm
}: PermissionSectionAutomationProps<FORM_TYPE>) {
  const productArea = ProductArea.AUTOMATION;
  const defaultLimitation = ScopedPermissionItem.ACCESS_ALL;
  const permissionSetField = getField<PermissionSet>(form, 'permissionSet');
  const permissionSet = permissionSetField?.value;
  const role = getAreaRoleFromPermissionSet(productArea, permissionSet);
  const limitedPermission = permissionSet ? getScopeFromProductArea(productArea, permissionSet) : defaultLimitation;
  const onUpdatePermissionSet = (selected: AreaRoleWithCustomType | undefined, limitation: ScopedPermissionType) => {
    if (!permissionSet || role === 'CUSTOM') return;

    const newPermissionSet = updatePermissionSetForLimitableProductArea(
      permissionSet,
      productArea,
      limitation,
      selected
    );

    setForm(updateFormField(form, 'permissionSet', newPermissionSet, true));
  };

  return (
    <TabSelect
      activePanelId={limitedPermission}
      onChange={panelId => onUpdatePermissionSet(role, panelId ?? defaultLimitation)}
    >
      <TabSelectHeader>
        <SvgIcon type={icon} size="l" />
        <Typography variant="heading-200" component="h3" noMargin>
          {title}
        </Typography>
      </TabSelectHeader>
      <TabSelectMenu>
        {[ScopedPermissionItem.ACCESS_ALL, ScopedPermissionItem.NO_ACCESS].map(context => (
          <TabSelectItem key={context} forId={context} withRadioButton>
            {t('in-settings:permissionScope.selection', { context: context.toLowerCase() })}
          </TabSelectItem>
        ))}
      </TabSelectMenu>
      <TabSelectPanels>
        <TabSelectPanel key={ScopedPermissionItem.ACCESS_ALL} id={ScopedPermissionItem.ACCESS_ALL}>
          <AutomationAccessPanel
            form={form}
            setForm={setForm}
            scopedPermissionItem={ScopedPermissionItem.ACCESS_ALL}
            role={role}
          />
        </TabSelectPanel>
        <TabSelectPanel key={ScopedPermissionItem.NO_ACCESS} id={ScopedPermissionItem.NO_ACCESS}>
          <NoAccessPanel productArea={productArea} />
        </TabSelectPanel>
      </TabSelectPanels>
    </TabSelect>
  );
}
