/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapFormItems } from 'formalistic';
import React from 'react';

import { SvgIcon, Typography } from '@instana/components';
import { PermissionSet, Result } from '@instana/types';
import { Observable } from '@instana/observables';

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
import SyntheticAccessAllPanel from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/Panels/SyntheticAccessPanels/SyntheticAllAccessPanel';
import LimitedAccessPanel from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/Panels/LimitedAccessPanel';
import {
  ExtractIdFunction,
  ExtractNameFunction
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/types';
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
import { t } from 'in-i18n';

export interface PermissionSectionSyntheticProps<I extends Object, FORM_TYPE extends MapFormItems>
  extends SlideControlProps<SubSlideConfig>,
    FormControlProps<FORM_TYPE> {
  title: string;
  accessAllDescription: string;
  limitedAccessDescription: string;
  addButtonLabel: string;
  roleTooltipText: string | React.ReactElement;
  observable: () => Observable<Result<I[]>>;
  extractId: ExtractIdFunction<I>;
  extractName: ExtractNameFunction<I>;
  icon: string;
  syntheticCredentials?: () => Observable<Result<I[]>>;
}

export default function PermissionSectionSyntheticMonitoring<I extends Object, FORM_TYPE extends MapFormItems>({
  title,
  addButtonLabel,
  roleTooltipText,
  icon,
  observable,
  extractId,
  extractName,
  form,
  setForm,
  setSubSlideConfig,
  setShowSubSlide,
  syntheticCredentials
}: PermissionSectionSyntheticProps<I, FORM_TYPE>) {
  const productArea = ProductArea.SYNTHETICS;
  const entityPermissionKey = 'syntheticTestIds';
  const credentialPermissionKey = 'syntheticCredentialKeys';

  const defaultLimitation = ScopedPermissionItem.ACCESS_ALL;
  const permissionSetField = getField<PermissionSet>(form, 'permissionSet');
  const permissionSet = permissionSetField?.value;
  const role = getAreaRoleFromPermissionSet(productArea, permissionSet);
  const limitedPermission = permissionSet ? getScopeFromProductArea(productArea, permissionSet) : defaultLimitation;

  const onUpdatePermissionSet = (selected: AreaRoleWithCustomType | undefined, limitation: ScopedPermissionType) => {
    if (!permissionSet || selected === 'CUSTOM') return;

    const {
      [entityPermissionKey]: entityIds,
      [credentialPermissionKey]: credentialIds,
      ...restPermissionSet
    } = updatePermissionSetForLimitableProductArea(permissionSet, productArea, limitation, selected);

    const newPermissionSet = {
      ...restPermissionSet,
      [entityPermissionKey]: limitation === ScopedPermissionItem.LIMITED_ACCESS ? entityIds : [],
      [credentialPermissionKey]: limitation === ScopedPermissionItem.LIMITED_ACCESS ? credentialIds : []
    };

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
              <SyntheticAccessAllPanel
                role={role}
                form={form}
                setForm={setForm}
                onChangeRole={selected => onUpdatePermissionSet(selected, ScopedPermissionItem.ACCESS_ALL)}
                entityPermissionKey={entityPermissionKey}
                roleTooltipText={roleTooltipText}
              />
            )}
            {context === ScopedPermissionItem.NO_ACCESS && <NoAccessPanel productArea={productArea} />}
            {context === ScopedPermissionItem.LIMITED_ACCESS && (
              <LimitedAccessPanel
                addButtonLabel={addButtonLabel}
                role={role}
                form={form}
                observable={observable}
                extractId={extractId}
                extractName={extractName}
                setForm={setForm}
                roleTooltipText={roleTooltipText}
                entityPermissionKey={entityPermissionKey}
                onChangeRole={selected => onUpdatePermissionSet(selected, ScopedPermissionItem.LIMITED_ACCESS)}
                setShowSubSlide={setShowSubSlide}
                setSubSlideConfig={setSubSlideConfig}
                productArea={productArea}
                syntheticCredentials={syntheticCredentials}
              />
            )}
          </TabSelectPanel>
        ))}
      </TabSelectPanels>
    </TabSelect>
  );
}
