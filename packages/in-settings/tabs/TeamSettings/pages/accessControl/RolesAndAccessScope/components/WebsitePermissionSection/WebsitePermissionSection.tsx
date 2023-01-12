/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { SvgIcon, Typography } from '@instana/components';

import {
  getAreaRoleFromPermissionSet,
  getField,
  updateFormField,
  getScopeFromProductArea,
  updatePermissionSetForLimitableProductArea
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import {
  AreaRoleWithCustomType,
  ProductArea,
  ScopedPermissionItem,
  ScopedPermissionItems,
  ScopedPermissionType
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import WebsiteLimitedAccessPanel from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/WebsitePermissionSection/WebsiteLimitedAccesPanel';
import WebsiteAccessAllPanel from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/WebsitePermissionSection/WebsiteAccessAllPanel';
import WebsiteNoAccessPanel from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/WebsitePermissionSection/WebsiteNoAccessPanel';
import TabSelect, {
  TabSelectHeader,
  TabSelectItem,
  TabSelectMenu,
  TabSelectPanel,
  TabSelectPanels
} from 'in-components/TabSelect';
import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import { SubSlideConfig } from 'in-settings/components/ConfigDialog/ConfigDialog';
import { SlideControlProps } from 'in-settings/hooks/useSubSlideControl';
import { PermissionSetWithRoles } from 'in-types';
import { t } from 'in-i18n';

export interface WebsitePermissionSectionProps extends SlideControlProps<SubSlideConfig>, FormControlProps {}

export default function WebsitePermissionSection({
  form,
  setForm,
  setSubSlideConfig,
  setShowSubSlide
}: WebsitePermissionSectionProps) {
  const defaultLimitation = ScopedPermissionItem.ACCESS_ALL;
  const permissionSetField = getField<PermissionSetWithRoles>(form, 'permissionSet');
  const permissionSet = permissionSetField?.value;
  const role = getAreaRoleFromPermissionSet(ProductArea.WEBSITE, permissionSet);

  const limitedPermission = permissionSet
    ? getScopeFromProductArea(ProductArea.WEBSITE, permissionSet)
    : defaultLimitation;

  const onUpdatePermissionSet = (role: AreaRoleWithCustomType | undefined, limitation: ScopedPermissionType) => {
    if (!permissionSet || role === 'CUSTOM') return;

    const { websiteIds, ...restPermissionSet } = updatePermissionSetForLimitableProductArea(
      permissionSet,
      ProductArea.WEBSITE,
      limitation,
      role
    );

    const newPermissionSet = {
      ...restPermissionSet,
      websiteIds: limitation === ScopedPermissionItem.LIMITED_ACCESS ? websiteIds : []
    };

    setForm(updateFormField(form, 'permissionSet', newPermissionSet, true));
  };

  return (
    <TabSelect<ScopedPermissionType>
      initialActivePanelId={limitedPermission}
      onChange={(_panelId, value) => onUpdatePermissionSet(role, value ?? defaultLimitation)}
    >
      <TabSelectHeader>
        <SvgIcon type="lib_website" size="l" />
        <Typography variant="heading-200" component="h3" noMargin>
          {t('in-settings:websitePermissionSection.title')}
        </Typography>
      </TabSelectHeader>
      <TabSelectMenu>
        {ScopedPermissionItems.map(context => (
          <TabSelectItem key={context} forId={context} value={context} withRadioButton>
            {t('in-settings:permissionScope.selection', { context: context.toLowerCase() })}
          </TabSelectItem>
        ))}
      </TabSelectMenu>
      <TabSelectPanels>
        {ScopedPermissionItems.map(context => (
          <TabSelectPanel key={context} id={context}>
            {context === ScopedPermissionItem.ACCESS_ALL && (
              <WebsiteAccessAllPanel
                role={role}
                onChangeRole={role => onUpdatePermissionSet(role, ScopedPermissionItem.ACCESS_ALL)}
              />
            )}
            {context === ScopedPermissionItem.NO_ACCESS && <WebsiteNoAccessPanel />}
            {context === ScopedPermissionItem.LIMITED_ACCESS && (
              <WebsiteLimitedAccessPanel
                role={role}
                form={form}
                setForm={setForm}
                onChangeRole={role => onUpdatePermissionSet(role, ScopedPermissionItem.LIMITED_ACCESS)}
                setShowSubSlide={setShowSubSlide}
                setSubSlideConfig={setSubSlideConfig}
              />
            )}
          </TabSelectPanel>
        ))}
      </TabSelectPanels>
    </TabSelect>
  );
}
