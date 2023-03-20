/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { PermissionSetWithRoles } from '@instana/types/typeDefinitions';
import { SvgIcon, Typography } from '@instana/components';

import {
  getField,
  getScopeFromProductArea,
  updateFormField,
  updatePermissionSetForLimitableProductArea
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import {
  ProductArea,
  ScopedPermissionItem,
  ScopedPermissionType
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import KubernetesLimitedAccessPanel from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/Panels/KubernetesLimitedAccessPanel';
import TabSelect, {
  TabSelectHeader,
  TabSelectItem,
  TabSelectMenu,
  TabSelectPanel,
  TabSelectPanels
} from 'in-components/TabSelect';
import AccessAllPanel from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/Panels/AccessAllPanel';
import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import NoAccessPanel from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/Panels/NoAccessPanel';
import { t } from 'in-i18n';

/**
 * Properties for the current component
 * @property isChild determines the header / icon size
 */
export interface PermissionSectionInfrastructureProps extends FormControlProps {
  isChild?: boolean;
}

/**
 * Actual component
 * @param to configure component
 * @returns component
 */
export default function _KubernetesEditSection({ form, isChild, setForm }: PermissionSectionInfrastructureProps) {
  const permissionSetField = getField<PermissionSetWithRoles>(form, 'permissionSet');
  const permissionSet = permissionSetField?.value;

  /**
   * Callback to set new scope
   * @param newScope to be set
   * @returns never / void
   */
  const setSelectedScope = (newScope: ScopedPermissionType | undefined) => {
    if (!permissionSet?.permissions) return;
    const newPermissionSet = updatePermissionSetForLimitableProductArea(
      permissionSet,
      ProductArea.KUBERNETES,
      newScope ?? ScopedPermissionItem.NO_ACCESS
    );
    setForm(updateFormField(form, 'permissionSet', newPermissionSet, true));
  };

  const initialScope = permissionSet
    ? getScopeFromProductArea(ProductArea.KUBERNETES, permissionSet)
    : ScopedPermissionItem.NO_ACCESS;

  // adjust sizes based on standalone or subcomponent of platforms
  const iconSize = isChild ? 's' : 'l';
  const headingVariant = isChild ? 'heading-100' : 'heading-200';
  const headingComponent = isChild ? 'h4' : 'h3';

  return (
    <TabSelect<ScopedPermissionType>
      initialActivePanelId={initialScope}
      onChange={(_panelId, value) => setSelectedScope(value)}
    >
      <TabSelectHeader>
        <SvgIcon type="lib_kubernetes" size={iconSize} />
        <Typography variant={headingVariant} component={headingComponent} noMargin>
          {t('in-settings:productAreas.kubernetes')}
        </Typography>
      </TabSelectHeader>
      <TabSelectMenu>
        <TabSelectItem key="ACCESS_ALL" forId="ACCESS_ALL" value={ScopedPermissionItem.ACCESS_ALL} withRadioButton>
          {t('in-settings:permissionScope.selection', { context: 'access_all' })}
        </TabSelectItem>
        <TabSelectItem
          key="LIMITED_ACCESS"
          forId="LIMITED_ACCESS"
          value={ScopedPermissionItem.LIMITED_ACCESS}
          withRadioButton
        >
          {t('in-settings:permissionScope.selection', { context: 'limited_access' })}
        </TabSelectItem>
        <TabSelectItem key="NO_ACCESS" forId="NO_ACCESS" value={ScopedPermissionItem.NO_ACCESS} withRadioButton>
          {t('in-settings:permissionScope.selection', { context: 'no_access' })}
        </TabSelectItem>
      </TabSelectMenu>
      <TabSelectPanels>
        <TabSelectPanel key="ACCESS_ALL" id="ACCESS_ALL">
          <AccessAllPanel
            title={t('in-settings:permissionScope.selection', { context: 'access_all' })}
            description={t('in-settings:PermissionSection.descriptionAccessAll_kubernetes')}
          />
        </TabSelectPanel>
        <TabSelectPanel key="LIMITED_ACCESS" id="LIMITED_ACCESS">
          <KubernetesLimitedAccessPanel />
        </TabSelectPanel>
        <TabSelectPanel key="NO_ACCESS" id="NO_ACCESS">
          <NoAccessPanel descriptionContext="kubernetes" />
        </TabSelectPanel>
      </TabSelectPanels>
    </TabSelect>
  );
}
