/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapFormItems } from 'formalistic';
import React from 'react';

import { PermissionSet } from '@instana/types/typeDefinitions';
import { SvgIcon, Typography } from '@instana/components';

import {
  getField,
  getScopeFromProductArea,
  updateFormField,
  updatePermissionSetForLimitableProductArea
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import {
  ProductArea,
  ScopedPermissionItem,
  ScopedPermissionType
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import KubernetesLimitedAccessPanel from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/Panels/KubernetesLimitedAccessPanel';
import TabSelect, {
  TabSelectHeader,
  TabSelectItem,
  TabSelectMenu,
  TabSelectPanel,
  TabSelectPanels
} from 'in-components/TabSelect';
import AccessAllPanel from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/Panels/AccessAllPanel';
import { FormControlProps } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import NoAccessPanel from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/Panels/NoAccessPanel';
import { SubSlideConfig } from 'in-settings/components/ConfigDialog/ConfigDialog';
import { SlideControlProps } from 'in-settings/hooks/useSubSlideControl';
import { t } from 'in-i18n';

/**
 * Properties for the current component
 * @property isChild determines the header / icon size
 */
export interface PermissionSectionInfrastructureProps<FORM_TYPE extends MapFormItems>
  extends FormControlProps<FORM_TYPE>,
    SlideControlProps<SubSlideConfig> {
  isChild?: boolean;
}

/**
 * Actual component
 * @param to configure component
 * @returns component
 */
export default function _KubernetesEditSection<FORM_TYPE extends MapFormItems>({
  form,
  isChild,
  setForm,
  setShowSubSlide,
  setSubSlideConfig
}: PermissionSectionInfrastructureProps<FORM_TYPE>) {
  const permissionSetField = getField<PermissionSet>(form, 'permissionSet');
  const permissionSet = permissionSetField?.value;

  /**
   * Callback to set new scope
   * @param newScope to be set
   * @returns never / void
   */
  const setSelectedScope = (newScope: ScopedPermissionType | undefined) => {
    if (!permissionSet?.permissions) return;

    const { kubernetesClusterUUIDs, kubernetesNamespaceUIDs, ...restPermissionSet } =
      updatePermissionSetForLimitableProductArea(
        permissionSet,
        ProductArea.KUBERNETES,
        newScope ?? ScopedPermissionItem.NO_ACCESS
      );

    const newPermissionSet = {
      ...restPermissionSet,
      kubernetesClusterUUIDs: newScope === ScopedPermissionItem.LIMITED_ACCESS ? kubernetesClusterUUIDs : [],
      kubernetesNamespaceUIDs: newScope === ScopedPermissionItem.LIMITED_ACCESS ? kubernetesNamespaceUIDs : []
    };
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
    <TabSelect activePanelId={initialScope} onChange={panelId => setSelectedScope(panelId)}>
      <TabSelectHeader>
        <SvgIcon type="lib_kubernetes" size={iconSize} />
        <Typography variant={headingVariant} component={headingComponent} noMargin>
          {t('in-settings:productAreas.kubernetes')}
        </Typography>
      </TabSelectHeader>
      <TabSelectMenu>
        <TabSelectItem key="ACCESS_ALL" forId={ScopedPermissionItem.ACCESS_ALL} withRadioButton>
          {t('in-settings:permissionScope.selection', { context: 'access_all' })}
        </TabSelectItem>
        <TabSelectItem key="LIMITED_ACCESS" forId={ScopedPermissionItem.LIMITED_ACCESS} withRadioButton>
          {t('in-settings:permissionScope.selection', { context: 'limited_access' })}
        </TabSelectItem>
        <TabSelectItem key="NO_ACCESS" forId={ScopedPermissionItem.NO_ACCESS} withRadioButton>
          {t('in-settings:permissionScope.selection', { context: 'no_access' })}
        </TabSelectItem>
      </TabSelectMenu>
      <TabSelectPanels>
        <TabSelectPanel key="ACCESS_ALL" id={ScopedPermissionItem.ACCESS_ALL}>
          <AccessAllPanel productArea={ProductArea.KUBERNETES} form={form} setForm={setForm} />
        </TabSelectPanel>
        <TabSelectPanel key="LIMITED_ACCESS" id={ScopedPermissionItem.LIMITED_ACCESS}>
          <KubernetesLimitedAccessPanel
            setForm={setForm}
            form={form}
            setSubSlideConfig={setSubSlideConfig}
            setShowSubSlide={setShowSubSlide}
          />
        </TabSelectPanel>
        <TabSelectPanel key="NO_ACCESS" id={ScopedPermissionItem.NO_ACCESS}>
          <NoAccessPanel productArea={ProductArea.KUBERNETES} />
        </TabSelectPanel>
      </TabSelectPanels>
    </TabSelect>
  );
}
