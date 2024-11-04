/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapFormItems } from 'formalistic';
import React, { useState } from 'react';

import { PermissionSet, Result, ScopeBinding } from '@instana/types';
import { SvgIcon, Typography } from '@instana/components';
import { Observable } from '@instana/observables';

import {
  AreaRoleWithContributor,
  AreaRoleWithContributorType,
  AreaRoleWithCustomType,
  LimitableProductArea,
  ProductArea,
  ScopeRoles,
  ScopedPermissionItem,
  ScopedPermissionItems,
  ScopedPermissionType
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import {
  getAreaRoleFromPermissionSet,
  getDefaultApplicationConfig,
  getField,
  getScopeFromProductArea,
  updateFormField,
  updatePermissionSetForLimitableProductArea
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import {
  ExtractContributionFilterNameFunction,
  ExtractIdFunction,
  ExtractNameFunction
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/types';
import LimitedAccessPanel from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/Panels/LimitedAccessPanel';
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
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { SubSlideConfig } from 'in-settings/components/ConfigDialog/ConfigDialog';
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
  extractContributionFilterName?: ExtractContributionFilterNameFunction<I>;
  productArea: LimitableProductArea;
  icon: string;
  entityPermissionKey: EntityPermissionKey;
  setValid?: (isValid: boolean) => void;
  editMode?: boolean;
}

export default function PermissionSection<I extends Object, FORM_TYPE extends MapFormItems>({
  title,
  addButtonLabel,
  roleTooltipText,
  productArea,
  icon,
  entityPermissionKey,
  observable,
  extractId,
  extractName,
  extractContributionFilterName,
  form,
  setForm,
  setSubSlideConfig,
  setShowSubSlide,
  setValid,
  editMode
}: PermissionSectionProps<I, FORM_TYPE>) {
  const defaultLimitation = ScopedPermissionItem.ACCESS_ALL;
  const applicationEntityKey = 'applicationIds';
  const permissionSetField = getField<PermissionSet>(form, 'permissionSet');
  const permissionSet = permissionSetField?.value;
  const role = getAreaRoleFromPermissionSet(productArea, permissionSet);
  const limitedPermission = permissionSet ? getScopeFromProductArea(productArea, permissionSet) : defaultLimitation;

  const defaultApplicationConfig = getDefaultApplicationConfig(getField<string>(form, 'name')?.value);
  const [initialApplicationConfig] = useState({
    label: getField<string>(form, 'label')?.value,
    scope: getField<string>(form, 'scope')?.value,
    tagFilterExpression: getField<FormModelElement[]>(form, 'tagFilterExpression')?.value,
    [applicationEntityKey]: permissionSet
      ? permissionSet[applicationEntityKey]?.filter(entity => entity.scopeRoleId === ScopeRoles.Contributor)
      : [],
    restrictingApplicationId: permissionSet?.restrictedApplicationFilter?.restrictingApplicationId ?? undefined
  });

  const isAppContributionFilterConfigured =
    permissionSet?.restrictedApplicationFilter?.tagFilterExpression?.type !== undefined;

  const updateEntityIds = (
    entityIds: ScopeBinding[],
    role: AreaRoleWithContributorType | undefined,
    productArea: LimitableProductArea,
    limitation: ScopedPermissionType,
    contributionFilterName: string | undefined
  ) => {
    // Application
    if (productArea === ProductArea.APPLICATION) {
      let newEntityIds: ScopeBinding[] = [];
      // Only show applications with contributor access for access all
      if (limitation === ScopedPermissionItem.ACCESS_ALL && role === AreaRoleWithContributor.CONTRIBUTOR) {
        newEntityIds = entityIds.filter(scopeBinding => scopeBinding.scopeRoleId === ScopeRoles.Contributor);
      } else if (limitation === ScopedPermissionItem.LIMITED_ACCESS) {
        const newScopeRoleId = role === AreaRoleWithContributor.OWNER ? ScopeRoles.Owner : ScopeRoles.Viewer;
        newEntityIds = entityIds?.map(entityId => {
          if (role === AreaRoleWithContributor.CONTRIBUTOR) {
            if (entityId.scopeRoleId !== ScopeRoles.Contributor) {
              if (initialApplicationConfig[applicationEntityKey]?.some(item => item.scopeId === entityId.scopeId)) {
                // Restore previous contribution AP (if change from contributor to owner/viewer back to contributor happened without saving)
                return { scopeId: entityId.scopeId, scopeRoleId: ScopeRoles.Contributor };
              } else {
                // Contributor: Change all non contributor APs to Viewer
                return { scopeId: entityId.scopeId, scopeRoleId: ScopeRoles.Viewer };
              }
            } else {
              // Contributor: Keep existing contributor APs
              return entityId;
            }
          } else {
            // Viewer/Owner: Change all APs to new scope role
            return { scopeId: entityId.scopeId, scopeRoleId: newScopeRoleId };
          }
        });
      }

      // Append contribution filter AP (parent) if required
      if (
        editMode &&
        role === AreaRoleWithContributor.CONTRIBUTOR &&
        initialApplicationConfig?.restrictingApplicationId &&
        contributionFilterName === initialApplicationConfig?.label &&
        entityIds.some(item => item.scopeId === initialApplicationConfig.restrictingApplicationId) === false
      ) {
        newEntityIds.push({
          scopeId: initialApplicationConfig.restrictingApplicationId,
          scopeRoleId: ScopeRoles.Viewer
        });
      }

      return newEntityIds;
    } else {
      return limitation === ScopedPermissionItem.LIMITED_ACCESS ? entityIds : [];
    }
  };

  const onUpdatePermissionSet = (selected: AreaRoleWithCustomType | undefined, limitation: ScopedPermissionType) => {
    let label;
    let tagFilterExpression;
    let scope;
    let restrictedApplicationFilter;
    if (!permissionSet || selected === 'CUSTOM') return;
    const { [entityPermissionKey]: entityIds, ...restPermissionSet } = updatePermissionSetForLimitableProductArea(
      permissionSet,
      productArea,
      limitation,
      selected
    );
    if (productArea === ProductArea.APPLICATION) {
      if (selected === AreaRoleWithContributor.CONTRIBUTOR && limitation !== ScopedPermissionItem.NO_ACCESS) {
        label = editMode ? initialApplicationConfig.label : defaultApplicationConfig.label;
        tagFilterExpression = initialApplicationConfig.tagFilterExpression;
        scope = initialApplicationConfig.scope;
      } else {
        label = defaultApplicationConfig.label;
        tagFilterExpression = undefined;
        scope = defaultApplicationConfig.scope;
      }

      restrictedApplicationFilter = {
        ...defaultApplicationConfig,
        restrictingApplicationId:
          editMode && label === initialApplicationConfig.label
            ? initialApplicationConfig?.restrictingApplicationId
            : undefined
      };

      form = updateFormField(form, 'label', label);
      form = updateFormField(form, 'tagFilterExpression', tagFilterExpression);
      form = updateFormField(form, 'scope', scope);
    }

    // Update entity id list based on selected access type
    const newEntityIds = updateEntityIds(entityIds, selected, productArea, limitation, label);

    const newPermissionSet = {
      ...restPermissionSet,
      [entityPermissionKey]: newEntityIds,
      ...(productArea === ProductArea.APPLICATION && {
        ['restrictedApplicationFilter']: tagFilterExpression ? restrictedApplicationFilter : undefined
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
                  productArea={productArea}
                  contributionFilterConfigured={isAppContributionFilterConfigured}
                  form={form}
                  setForm={setForm}
                  setValid={setValid}
                  editMode={editMode}
                />
              </>
            )}
            {context === ScopedPermissionItem.NO_ACCESS && <NoAccessPanel productArea={productArea} />}
            {context === ScopedPermissionItem.LIMITED_ACCESS && (
              <LimitedAccessPanel
                addButtonLabel={addButtonLabel}
                entityPermissionKey={entityPermissionKey}
                role={role}
                form={form}
                observable={observable}
                extractId={extractId}
                extractName={extractName}
                extractContributionFilterName={extractContributionFilterName}
                setForm={setForm}
                roleTooltipText={roleTooltipText}
                onChangeRole={selected => onUpdatePermissionSet(selected, ScopedPermissionItem.LIMITED_ACCESS)}
                setShowSubSlide={setShowSubSlide}
                setSubSlideConfig={setSubSlideConfig}
                productArea={productArea}
                setValid={setValid}
                editMode={editMode}
              />
            )}
          </TabSelectPanel>
        ))}
      </TabSelectPanels>
    </TabSelect>
  );
}
