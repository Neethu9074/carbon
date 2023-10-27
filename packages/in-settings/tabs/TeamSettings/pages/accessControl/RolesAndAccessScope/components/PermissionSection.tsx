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
  AreaRoleWithContributer,
  AreaRoleWithContributerType,
  AreaRoleWithCustomType,
  LimitableProductArea,
  ProductArea,
  ScopedPermissionItem,
  ScopedPermissionItems,
  ScopedPermissionType
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import {
  getAreaRoleFromPermissionSet,
  getDefaultApplicationConfig,
  getField,
  getScopeFromProductArea,
  updateFormField,
  updatePermissionSetForLimitableProductArea
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import LimitingApplicationFilterWrapper from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/LimitingApplicationFilter/LimitingApplicationFilterWrapper';
import TabSelect, {
  TabSelectHeader,
  TabSelectItem,
  TabSelectMenu,
  TabSelectPanel,
  TabSelectPanels
} from 'in-components/TabSelect';
import LimitedAccessPanel from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/Panels/LimitedAccessPanel';
import {
  ExtractIdFunction,
  ExtractNameFunction
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/types';
import AccessAllPanel from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/Panels/AccessAllPanel';
import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import NoAccessPanel from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/Panels/NoAccessPanel';
import { SubSlideConfig } from 'in-settings/components/ConfigDialog/ConfigDialog';
import { applicationContributionFilterEnabled } from 'in-services/featureFlags';
import { SlideControlProps } from 'in-settings/hooks/useSubSlideControl';
import { t } from 'in-i18n';

export type EntityPermissionKey = 'mobileAppIds' | 'websiteIds' | 'applicationIds' | 'syntheticTestIds';

export interface PermissionSectionProps<I extends Object, FORM_TYPE extends MapFormItems>
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
  productArea: LimitableProductArea;
  icon: string;
  entityPermissionKey: EntityPermissionKey;
}

export default function PermissionSection<I extends Object, FORM_TYPE extends MapFormItems>({
  title,
  accessAllDescription,
  limitedAccessDescription,
  addButtonLabel,
  roleTooltipText,
  productArea,
  icon,
  entityPermissionKey,
  observable,
  extractId,
  extractName,
  form,
  setForm,
  setSubSlideConfig,
  setShowSubSlide
}: PermissionSectionProps<I, FORM_TYPE>) {
  const defaultLimitation = ScopedPermissionItem.ACCESS_ALL;
  const permissionSetField = getField<PermissionSet>(form, 'permissionSet');
  const permissionSet = permissionSetField?.value;
  const role = getAreaRoleFromPermissionSet(productArea, permissionSet);
  const limitedPermission = permissionSet ? getScopeFromProductArea(productArea, permissionSet) : defaultLimitation;

  const defaultApplicationConfig = getDefaultApplicationConfig(getField<string>(form, 'name')?.value);
  const isContributerRole =
    applicationContributionFilterEnabled &&
    productArea === ProductArea.APPLICATION &&
    role === AreaRoleWithContributer.CONTRIBUTER;

  const onUpdatePermissionSet = (
    selected: AreaRoleWithCustomType | AreaRoleWithContributerType | undefined,
    limitation: ScopedPermissionType
  ) => {
    if (!permissionSet || selected === 'CUSTOM') return;
    const { [entityPermissionKey]: entityIds, ...restPermissionSet } = updatePermissionSetForLimitableProductArea(
      permissionSet,
      productArea,
      limitation,
      selected
    );
    if (applicationContributionFilterEnabled) {
      if (
        (productArea === ProductArea.APPLICATION && selected !== AreaRoleWithContributer.CONTRIBUTER) ||
        (productArea === ProductArea.APPLICATION && limitedPermission !== limitation)
      ) {
        form = updateFormField(form, 'tagFilterExpression', defaultApplicationConfig.tagFilterExpression);
        form = updateFormField(form, 'scope', defaultApplicationConfig.scope);
      } else if (productArea === ProductArea.APPLICATION && selected === AreaRoleWithContributer.CONTRIBUTER) {
        form = updateFormField(form, 'label', getField<string>(form, 'name')?.value);
      }
    }
    const newPermissionSet = {
      ...restPermissionSet,
      [entityPermissionKey]: limitation === ScopedPermissionItem.LIMITED_ACCESS ? entityIds : [],
      ['restrictedApplicationFilter']:
        selected === AreaRoleWithContributer.CONTRIBUTER ? defaultApplicationConfig : undefined
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
              <>
                <AccessAllPanel
                  role={role}
                  onChangeRole={selected => onUpdatePermissionSet(selected, ScopedPermissionItem.ACCESS_ALL)}
                  entityPermissionKey={entityPermissionKey}
                  roleTooltipText={roleTooltipText}
                  description={accessAllDescription}
                  isContributerRole={isContributerRole}
                />
                {isContributerRole && <LimitingApplicationFilterWrapper form={form} setForm={setForm} />}
              </>
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
                onChangeRole={selected => onUpdatePermissionSet(selected, ScopedPermissionItem.LIMITED_ACCESS)}
                setShowSubSlide={setShowSubSlide}
                setSubSlideConfig={setSubSlideConfig}
                isContributerRole={isContributerRole}
              />
            )}
          </TabSelectPanel>
        ))}
      </TabSelectPanels>
    </TabSelect>
  );
}
