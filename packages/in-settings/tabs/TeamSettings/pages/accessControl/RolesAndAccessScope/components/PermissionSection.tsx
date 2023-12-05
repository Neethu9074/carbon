/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapFormItems } from 'formalistic';
import React, { useState } from 'react';

import { SvgIcon, Typography } from '@instana/components';
import { PermissionSet, Result } from '@instana/types';
import { Observable } from '@instana/observables';

import {
  AreaRoleWithContributor,
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
import ContributionFilterWrapper from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/ApplicationContributionFilter/ContributionFilterWrapper';
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
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
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
  const [initialApplicationConfig] = useState({
    label: getField<string>(form, 'label')?.value,
    scope: getField<string>(form, 'scope')?.value,
    tagFilterExpression: getField<FormModelElement[]>(form, 'tagFilterExpression')?.value
  });
  const [initialLimitation] = useState(limitedPermission);
  const isContributorRole =
    applicationContributionFilterEnabled &&
    productArea === ProductArea.APPLICATION &&
    role === AreaRoleWithContributor.CONTRIBUTOR;
  const isAppContributionFilterConfigured =
    applicationContributionFilterEnabled &&
    permissionSet?.restrictedApplicationFilter?.tagFilterExpression?.type !== undefined;

  const onUpdatePermissionSet = (selected: AreaRoleWithCustomType | undefined, limitation: ScopedPermissionType) => {
    let label;
    let tagFilterExpression;
    let scope;

    if (!permissionSet || selected === 'CUSTOM') return;
    const { [entityPermissionKey]: entityIds, ...restPermissionSet } = updatePermissionSetForLimitableProductArea(
      permissionSet,
      productArea,
      limitation,
      selected
    );
    if (applicationContributionFilterEnabled && productArea === ProductArea.APPLICATION) {
      if (selected === AreaRoleWithContributor.CONTRIBUTOR && limitation === initialLimitation) {
        label = initialApplicationConfig.label;
        tagFilterExpression = initialApplicationConfig.tagFilterExpression;
        scope = initialApplicationConfig.scope;
      } else if (selected === AreaRoleWithContributor.CONTRIBUTOR && limitation !== ScopedPermissionItem.NO_ACCESS) {
        label = defaultApplicationConfig.label;
        tagFilterExpression = defaultApplicationConfig.tagFilterExpression;
        scope = defaultApplicationConfig.scope;
      } else {
        label = defaultApplicationConfig.label;
        tagFilterExpression = undefined;
        scope = defaultApplicationConfig.scope;
      }
      form = updateFormField(form, 'label', label);
      form = updateFormField(form, 'tagFilterExpression', tagFilterExpression);
      form = updateFormField(form, 'scope', scope);
    }
    const newPermissionSet = {
      ...restPermissionSet,
      [entityPermissionKey]: limitation === ScopedPermissionItem.LIMITED_ACCESS ? entityIds : [],
      ...(applicationContributionFilterEnabled &&
        productArea === ProductArea.APPLICATION && {
          ['restrictedApplicationFilter']: tagFilterExpression ? defaultApplicationConfig : undefined
        })
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
                  productArea={productArea}
                  contributionFilterConfigured={isAppContributionFilterConfigured}
                />
                {isContributorRole && (
                  <ContributionFilterWrapper form={form} setForm={setForm} isContributorRole={isContributorRole} />
                )}
              </>
            )}
            {context === ScopedPermissionItem.NO_ACCESS && <NoAccessPanel productArea={productArea} />}
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
                productArea={productArea}
              />
            )}
          </TabSelectPanel>
        ))}
      </TabSelectPanels>
    </TabSelect>
  );
}
