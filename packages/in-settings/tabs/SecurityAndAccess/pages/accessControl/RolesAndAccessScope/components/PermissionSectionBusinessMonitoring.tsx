/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapFormItems } from 'formalistic';
import React from 'react';

import { SvgIcon, Typography } from '@instana/components';
import { PermissionSet, Result } from '@instana/types';
import { Observable } from '@instana/observables';

import {
  getField,
  getScopeFromProductArea,
  updateFormField,
  updatePermissionSetForLimitableProductArea
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import BusinessMonitoringPanel from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/Panels/BusinessMonitoringPanels/BusinessMonitoringPanel';
import {
  ScopedPermissionItem,
  ScopedPermissionItems,
  ScopedPermissionType
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import TabSelect, {
  TabSelectHeader,
  TabSelectItem,
  TabSelectMenu,
  TabSelectPanel,
  TabSelectPanels
} from 'in-components/TabSelect';
import {
  ExtractIdFunction,
  ExtractNameFunction
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/types';
import { FormControlProps } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import { LimitableProductArea } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { SubSlideConfig } from 'in-settings/components/ConfigDialog/ConfigDialog';
import { SlideControlProps } from 'in-settings/hooks/useSubSlideControl';
import { t } from 'in-i18n';

export interface PermissionSectionBusinessMonitoringProps<I extends Object, FORM_TYPE extends MapFormItems>
  extends SlideControlProps<SubSlideConfig>,
    FormControlProps<FORM_TYPE> {
  title: string;
  accessAllTitle: string;
  accessAllDescription: string;
  noAccessTitle: string;
  noAccessDescription: string;
  limitedAccessTitle: string;
  limitedAccessDescription: string;
  productArea: LimitableProductArea;
  icon: string;
  setValid?: (isValid: boolean) => void;
  editMode?: boolean;
  observable: () => Observable<Result<I[]>>;
  extractId: ExtractIdFunction<I>;
  extractName: ExtractNameFunction<I>;
}

export default function PermissionSectionBusinessMonitoring<I extends Object, FORM_TYPE extends MapFormItems>({
  title,
  accessAllDescription,
  noAccessDescription,
  limitedAccessDescription,
  productArea,
  icon,
  form,
  setForm,
  observable,
  extractId,
  extractName,
  setSubSlideConfig,
  setShowSubSlide
}: PermissionSectionBusinessMonitoringProps<I, FORM_TYPE>) {
  return limitedEnabledSection();

  function limitedEnabledSection() {
    const defaultLimitation = ScopedPermissionItem.ACCESS_ALL;
    const permissionSetField = getField<PermissionSet>(form, 'permissionSet');
    const permissionSet = permissionSetField?.value;
    const limitedPermission = permissionSet ? getScopeFromProductArea(productArea, permissionSet) : defaultLimitation;

    const onUpdatePermissionSet = (limitation: ScopedPermissionType) => {
      if (!permissionSet) return;
      const { ...restPermissionSet } = updatePermissionSetForLimitableProductArea(
        permissionSet,
        productArea,
        limitation,
        undefined
      );
      const newPermissionSet = {
        ...restPermissionSet
      };
      setForm(updateFormField(form, 'permissionSet', newPermissionSet, true));
    };

    return (
      <TabSelect
        activePanelId={limitedPermission}
        onChange={panelId => onUpdatePermissionSet(panelId ?? defaultLimitation)}
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
                <BusinessMonitoringPanel
                  title={t('in-settings:productAreas.permissions')}
                  description={accessAllDescription}
                  extractId={extractId}
                  extractName={extractName}
                  observable={observable}
                  form={form}
                  setForm={setForm}
                  setSubSlideConfig={setSubSlideConfig}
                  setShowSubSlide={setShowSubSlide}
                  access="ALL"
                />
              )}
              {context === ScopedPermissionItem.NO_ACCESS && (
                <BusinessMonitoringPanel
                  title={t('in-settings:productAreas.permissions')}
                  description={noAccessDescription}
                  extractId={extractId}
                  extractName={extractName}
                  observable={observable}
                  form={form}
                  setForm={setForm}
                  setSubSlideConfig={setSubSlideConfig}
                  setShowSubSlide={setShowSubSlide}
                  access="NONE"
                />
              )}
              {context === ScopedPermissionItem.LIMITED_ACCESS && (
                <BusinessMonitoringPanel
                  title={t('in-settings:productAreas.permissions')}
                  description={limitedAccessDescription}
                  extractId={extractId}
                  extractName={extractName}
                  observable={observable}
                  form={form}
                  setForm={setForm}
                  setSubSlideConfig={setSubSlideConfig}
                  setShowSubSlide={setShowSubSlide}
                  access="LIMITED"
                />
              )}
            </TabSelectPanel>
          ))}
        </TabSelectPanels>
      </TabSelect>
    );
  }
}
