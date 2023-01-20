/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { PermissionSetWithRoles, Result } from '@instana/types';
import { SvgIcon, Typography } from '@instana/components';
import { Observable } from '@instana/observables';

import {
  getAreaRoleFromPermissionSet,
  getField,
  updateFormField,
  getScopeFromProductArea,
  updatePermissionSetForLimitableProductArea
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import {
  AreaRoleWithCustomType,
  LimitableProductArea,
  ScopedPermissionItem,
  ScopedPermissionItems,
  ScopedPermissionType
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import TabSelect, {
  TabSelectHeader,
  TabSelectItem,
  TabSelectMenu,
  TabSelectPanel,
  TabSelectPanels
} from 'in-components/TabSelect';
import LimitedAccessPanel from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/Panels/LimitedAccesPanel';
import {
  ExtractIdFunction,
  ExtractNameFunction
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/types';
import AccessAllPanel from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/Panels/AccessAllPanel';
import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import NoAccessPanel from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/Panels/NoAccessPanel';
import { SubSlideConfig } from 'in-settings/components/ConfigDialog/ConfigDialog';
import { SlideControlProps } from 'in-settings/hooks/useSubSlideControl';
import { t } from 'in-i18n';

export type EntityPermissionKey = 'mobileAppIds' | 'websiteIds' | 'applicationIds';
export interface PermissionSectionProps<I> extends SlideControlProps<SubSlideConfig>, FormControlProps {
  title: string;
  accessAllDescription: string;
  limitedAccessDescription: string;
  addButtonLabel: string;
  roleTooltipText: string;
  observable: () => Observable<Result<I[]>>;
  extractId: ExtractIdFunction<I>;
  extractName: ExtractNameFunction<I>;
  productArea: LimitableProductArea;
  entityPermissionKey: EntityPermissionKey;
}

export default function PermissionSection<I>({
  title,
  accessAllDescription,
  limitedAccessDescription,
  addButtonLabel,
  roleTooltipText,
  productArea,
  entityPermissionKey,
  observable,
  extractId,
  extractName,
  form,
  setForm,
  setSubSlideConfig,
  setShowSubSlide
}: PermissionSectionProps<I>) {
  const defaultLimitation = ScopedPermissionItem.ACCESS_ALL;
  const permissionSetField = getField<PermissionSetWithRoles>(form, 'permissionSet');
  const permissionSet = permissionSetField?.value;
  const role = getAreaRoleFromPermissionSet(productArea, permissionSet);

  const limitedPermission = permissionSet ? getScopeFromProductArea(productArea, permissionSet) : defaultLimitation;

  const onUpdatePermissionSet = (role: AreaRoleWithCustomType | undefined, limitation: ScopedPermissionType) => {
    if (!permissionSet || role === 'CUSTOM') return;

    const { [entityPermissionKey]: entityIds, ...restPermissionSet } = updatePermissionSetForLimitableProductArea(
      permissionSet,
      productArea,
      limitation,
      role
    );

    const newPermissionSet = {
      ...restPermissionSet,
      [entityPermissionKey]: limitation === ScopedPermissionItem.LIMITED_ACCESS ? entityIds : []
    };

    setForm(updateFormField(form, 'permissionSet', newPermissionSet, true));
  };

  return (
    <TabSelect<ScopedPermissionType>
      initialActivePanelId={limitedPermission}
      onChange={(_panelId, value) => onUpdatePermissionSet(role, value ?? defaultLimitation)}
    >
      <TabSelectHeader>
        <SvgIcon type="lib_mobile_app" size="l" />
        <Typography variant="heading-200" component="h3" noMargin>
          {title}
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
              <AccessAllPanel
                role={role}
                onChangeRole={role => onUpdatePermissionSet(role, ScopedPermissionItem.ACCESS_ALL)}
                entityPermissionKey={entityPermissionKey}
                roleTooltipText={roleTooltipText}
                description={accessAllDescription}
              />
            )}
            {context === ScopedPermissionItem.NO_ACCESS && <NoAccessPanel />}
            {context === ScopedPermissionItem.LIMITED_ACCESS && (
              <LimitedAccessPanel
                description={limitedAccessDescription}
                addButtonLabel={addButtonLabel}
                entityPermissionKey={entityPermissionKey}
                role={role}
                form={form}
                observable={observable}
                extractId={extractId}
                extractName={extractName}
                setForm={setForm}
                roleTooltipText={roleTooltipText}
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
