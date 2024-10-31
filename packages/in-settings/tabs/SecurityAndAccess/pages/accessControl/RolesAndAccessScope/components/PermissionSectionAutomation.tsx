/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapFormItems } from 'formalistic';
import React, { useState } from 'react';

import { SvgIcon, Typography } from '@instana/components';

import {
  getAreaRoleFromPermissionSet,
  getField,
  getScopeFromProductArea,
  updateFormField,
  updatePermissionSetForLimitableProductArea
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import {
  AreaRoleWithCustomType,
  ProductArea,
  ScopedPermissionItem,
  ScopedPermissionItems,
  ScopedPermissionType
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import AutomationAccessPanel from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/Panels/AutomationPanel/AutomationPanel';
import TabSelect, {
  TabSelectHeader,
  TabSelectItem,
  TabSelectMenu,
  TabSelectPanel,
  TabSelectPanels
} from 'in-components/TabSelect';
import { FormControlProps } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import NoAccessPanel from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/Panels/NoAccessPanel';
import { SubSlideConfig } from 'in-settings/components/ConfigDialog/ConfigDialog';
import { SlideControlProps } from 'in-settings/hooks/useSubSlideControl';
import { PermissionSet, ScopeBinding } from 'in-types';
import { t } from 'in-i18n';

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
  const entityPermissionKey = 'actionFilter';
  const defaultLimitation = ScopedPermissionItem.ACCESS_ALL;
  const permissionSetField = getField<PermissionSet>(form, 'permissionSet');
  const actionFilterField = getField<ScopeBinding>(form, entityPermissionKey);
  const permissionSet = permissionSetField?.value;
  const role = getAreaRoleFromPermissionSet(productArea, permissionSet);
  const limitedPermission = permissionSet ? getScopeFromProductArea(productArea, permissionSet) : defaultLimitation;
  const [initalActionFilter] = useState(actionFilterField?.value);
  const onUpdatePermissionSet = (selected: AreaRoleWithCustomType | undefined, limitation: ScopedPermissionType) => {
    if (!permissionSet || role === 'CUSTOM') return;

    const restPermissionSet = updatePermissionSetForLimitableProductArea(
      permissionSet,
      productArea,
      limitation,
      selected
    );

    const newActionFilter =
      limitation === ScopedPermissionItem.LIMITED_ACCESS
        ? initalActionFilter
        : { scopeId: undefined, scopeRoleId: '-1' };

    let updatedForm = updateFormField(form, entityPermissionKey, newActionFilter, true);
    const newPermissionSet: PermissionSet = {
      ...restPermissionSet,
      actionFilter: newActionFilter
    };
    updatedForm = updateFormField(updatedForm, 'permissionSet', newPermissionSet, true);
    setForm(updatedForm);
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
        {ScopedPermissionItems.map(context => (
          <TabSelectItem key={context} forId={context} withRadioButton>
            {t('in-settings:permissionScope.selection', { context: context.toLowerCase() })}
          </TabSelectItem>
        ))}
      </TabSelectMenu>
      <TabSelectPanels>
        {ScopedPermissionItems.map(context => (
          <TabSelectPanel key={context} id={context}>
            {(context === ScopedPermissionItem.ACCESS_ALL || context === ScopedPermissionItem.LIMITED_ACCESS) && (
              <AutomationAccessPanel form={form} setForm={setForm} scopedPermissionItem={context} role={role} />
            )}
            {context === ScopedPermissionItem.NO_ACCESS && <NoAccessPanel productArea={productArea} />}
          </TabSelectPanel>
        ))}
      </TabSelectPanels>
    </TabSelect>
  );
}
