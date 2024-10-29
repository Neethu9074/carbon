/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm, Field, MapFormItems } from 'formalistic';
import React, { useState } from 'react';

import { PermissionSet, Result } from '@instana/types';
import { useObservable } from '@instana/hooks';

import {
  getAllSyntheticCredentialsForEntitySelectionWithDefaults,
  getAllSyntheticTestsForEntitySelectionWithDefaults
} from 'in-synthetics/subscriptions/getAllSyntheticTestsForEntitySelection';
import {
  getAreaRoleFromPermissionSet,
  getField,
  getScopeFromProductArea,
  updateFormField
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import PermissionSectionSyntheticMonitoring from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/PermissionSectionSyntheticMonitoring';
import PermissionSectionBusinessMonitoring from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/PermissionSectionBusinessMonitoring';
import {
  AreaRoleWithContributor,
  ProductArea,
  ScopedPermissionItem
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import PermissionSectionInfrastructure from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/PermissionSectionInfrastructure';
import PermissionSectionAutomation from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/PermissionSectionAutomation';
// @ts-expect-error not migrated to typescript yet
import { isQueryValid } from 'in-applications/creation/components/CreateApplicationQueryBuilder';
import PlatformsEditSelection from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/PlatformsEditSelection';
import PermissionSelection from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/PermissionSelection';
import PermissionSection from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/PermissionSection';
import { FormControlProps } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import GroupNameSection from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/GroupNameSection';
import { getAllApplicationsForEntitySelectionWithDefaults } from 'in-applications/subscriptions/getAllApplicationsForEntitySelection';
import HeadingSection from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/HeadingSection';
import { getAllMobileAppsForEntitySelectionWithDefaults } from 'in-mobile-apps/subscriptions/getAllMobileAppsForEntitySelection';
import { getAllWebsitesForEntitySelectionWithDefaults } from 'in-websites/subscriptions/getAllWebsitesForEntitySelection';
import { amountPlatformAccesses, hasAPlatformAccess, hasKubernetesAccess } from 'in-stores/permission';
import useSubSlideControl, { SlideControlProps } from 'in-settings/hooks/useSubSlideControl';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { actionAutomationEnabled, syntheticsEnabled } from 'in-services/featureFlags';
import ConfigDialog, { SubSlideConfig } from 'in-settings/components/ConfigDialog';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { isBlank } from 'in-services/util/string';
import { t, Trans } from 'in-i18n';

interface EditAccessScopeDialogProps<FORM_TYPE extends MapFormItems> extends FormControlProps<FORM_TYPE> {
  editMode?: boolean;
  onSave: (form: MapForm<FORM_TYPE>) => void;
  onCancel: VoidFunction;
}

export default function EditAccessScopeDialog<FORM_TYPE extends MapFormItems>({
  form: originForm,
  setForm: _originSetForm,
  onSave,
  onCancel,
  editMode
}: EditAccessScopeDialogProps<FORM_TYPE>) {
  const [form, setForm] = useState(originForm);
  const { subSlideConfig, setSubSlideConfig, showSubSlide, setShowSubSlide } = useSubSlideControl();
  const context = editMode ? 'edit' : 'create';
  const timeConfig = useTimeConfig();

  const groupNameField = getField<string>(form, 'name');
  const tagFilterExpression = getField<FormModelElement[]>(form, 'tagFilterExpression')?.value ?? undefined;

  const globalSections = [
    ProductArea.MIXED,
    ProductArea.EVENT,
    ProductArea.LOGS,
    ProductArea.DASHBOARD,
    ProductArea.AGENTS,
    ProductArea.ACCESS_CONTROL
  ];

  const validTagFilterExpressionResult: Result<boolean> =
    useObservable(isQueryValid, [tagFilterExpression, timeConfig]) ?? pendingResult;

  let isValidContributionFilter = true;
  const [isValidContributionFilterName, setValidContributionFilterName] = useState(true);
  const permissionSetField = getField<PermissionSet>(form, 'permissionSet');

  const validateContributionFilter = () => {
    const permissionSet = getField<PermissionSet>(form, 'permissionSet')?.value;
    const role = getAreaRoleFromPermissionSet(ProductArea.APPLICATION, permissionSet);

    if (role === AreaRoleWithContributor.CONTRIBUTOR) {
      if (tagFilterExpression?.length === 0 || !isValidContributionFilterName) {
        isValidContributionFilter = false;
      } else {
        // Both tag filter expression and filter name need to be valid
        isValidContributionFilter = (validTagFilterExpressionResult?.data as boolean) && isValidContributionFilterName;
      }
    } else {
      isValidContributionFilter = true;
    }
  };

  validateContributionFilter();

  const formControlProps: FormControlProps<FORM_TYPE> = {
    form,
    setForm
  };

  const slideControlProps: SlideControlProps<SubSlideConfig> = {
    setSubSlideConfig,
    setShowSubSlide
  };

  const globalFunctionNavItems = globalSections
    .filter(area => area !== ProductArea.MIXED)
    .map(area => ({
      scrollId: area,
      label: t('in-settings:productAreas.title', { context: area.toLowerCase() }),
      title: t('in-settings:productAreas.title', { context: area.toLowerCase() }),
      valid: true,
      content: <></>
    }));

  const nameItem = !editMode
    ? [
        {
          scrollId: '1-group-name',
          label: t('in-settings:groupSection.title'),
          title: t('in-settings:groupSection.title'),
          valid: true,
          content: (
            <GroupNameSection
              value={groupNameField?.value}
              setValue={(value: string) => {
                const updatedForm = updateFormField(form, 'name', value, true);
                setForm(updateFormField(updatedForm, 'label', value, true));
              }}
            />
          )
        }
      ]
    : [];

  const platformTitleIfHasOnePlatform = () =>
    amountPlatformAccesses === 1 && hasKubernetesAccess
      ? t('in-settings:productAreas.kubernetes')
      : t('in-settings:productAreas.title_platforms');
  const platformTitle = hasAPlatformAccess ? platformTitleIfHasOnePlatform() : '';

  let navItems = [
    ...nameItem,
    {
      scrollId: '2-heading-section',
      label: t('in-settings:headingSection.title'),
      title: t('in-settings:headingSection.title'),
      valid: true,
      hidden: true,
      content: <HeadingSection />
    },
    {
      scrollId: '3-websites',
      label: t('in-settings:productAreas.title_websites'),
      title: t('in-settings:productAreas.title_websites'),
      valid: true,
      content: (
        <PermissionSection
          title={t('in-settings:productAreas.title_websites')}
          accessAllDescription={t('in-settings:PermissionSection.descriptionAccessAll_websites')}
          limitedAccessDescription={t('in-settings:PermissionSection.descriptionLimitedAccess_websites')}
          addButtonLabel={t('in-settings:PermissionSection.addButton_websites')}
          roleTooltipText={<Trans i18nKey="in-settings:permissionScope.roleTooltip_websites" />}
          entityPermissionKey="websiteIds"
          observable={() => getAllWebsitesForEntitySelectionWithDefaults({ timeConfig })}
          productArea={ProductArea.WEBSITE}
          icon="lib_website"
          extractId={({ id }) => id}
          extractName={({ name }) => name}
          {...formControlProps}
          {...slideControlProps}
        />
      )
    },
    {
      scrollId: '4-mobile.apps',
      label: t('in-settings:productAreas.title_mobileApps'),
      title: t('in-settings:productAreas.title_mobileApps'),
      valid: true,
      content: (
        <PermissionSection
          title={t('in-settings:productAreas.title_mobileApps')}
          accessAllDescription={t('in-settings:PermissionSection.descriptionAccessAll_mobileApps')}
          limitedAccessDescription={t('in-settings:PermissionSection.descriptionLimitedAccess_mobileApps')}
          addButtonLabel={t('in-settings:PermissionSection.addButton_mobileApps')}
          roleTooltipText={<Trans i18nKey="in-settings:permissionScope.roleTooltip_mobileApps" />}
          entityPermissionKey="mobileAppIds"
          observable={() => getAllMobileAppsForEntitySelectionWithDefaults({ timeConfig })}
          productArea={ProductArea.MOBILE_APP}
          icon="lib_mobile_app"
          extractId={({ id }) => id}
          extractName={({ name }) => name}
          {...formControlProps}
          {...slideControlProps}
        />
      )
    },
    {
      scrollId: '5-bizops',
      label: t('in-settings:productAreas.title_businessMonitoring'),
      title: t('in-settings:productAreas.title_businessMonitoring'),
      valid: true,
      content: (
        <PermissionSectionBusinessMonitoring
          title={t('in-settings:productAreas.title_businessMonitoring')}
          accessAllTitle={t('in-settings:permissionScope.title_access_all_bizops')}
          accessAllDescription={t('in-settings:permissionScope.description_access_all_bizops')}
          noAccessTitle={t('in-settings:permissionScope.title_no_access_bizops')}
          noAccessDescription={t('in-settings:permissionScope.description_no_access_bizops')}
          productArea={ProductArea.BIZOPS}
          icon="lib_bizops"
          {...formControlProps}
          {...slideControlProps}
        />
      )
    },
    {
      scrollId: '6-applications',
      label: t('in-settings:productAreas.title_applications'),
      title: t('in-settings:productAreas.title_applications'),
      valid: true,
      content: (
        <PermissionSection
          title={t('in-settings:productAreas.title_applications')}
          accessAllDescription={t('in-settings:PermissionSection.descriptionAccessAll_applications')}
          limitedAccessDescription={t('in-settings:PermissionSection.descriptionLimitedAccess_applications')}
          addButtonLabel={t('in-settings:PermissionSection.addButton_applications')}
          roleTooltipText={<Trans i18nKey="in-settings:permissionScope.roleTooltip_applications" />}
          entityPermissionKey="applicationIds"
          observable={() => getAllApplicationsForEntitySelectionWithDefaults({ timeConfig })}
          productArea={ProductArea.APPLICATION}
          icon="lib_application"
          extractId={({ id }) => id}
          extractName={({ name }) => name}
          extractContributionFilterName={({ supplementary }) => supplementary ?? ''}
          {...formControlProps}
          {...slideControlProps}
          setValid={setValidContributionFilterName}
          editMode={editMode}
        />
      )
    },
    {
      scrollId: '7-platforms',
      label: platformTitle,
      title: platformTitle,
      valid: true,
      content: <PlatformsEditSelection {...formControlProps} {...slideControlProps} />
    },
    {
      scrollId: '8-infrastructure',
      label: t('in-settings:productAreas.title_infrastructure'),
      title: t('in-settings:productAreas.title_infrastructure'),
      valid: true,
      content: (
        <PermissionSectionInfrastructure
          title={t('in-settings:productAreas.title_infrastructure')}
          icon="lib_infrastructure"
          {...formControlProps}
          {...slideControlProps}
        />
      )
    }
  ];

  navItems = syntheticsEnabled
    ? [
        ...navItems,
        {
          scrollId: '9-synthetics',
          label: t('in-settings:productAreas.title_syntheticMonitoring'),
          title: t('in-settings:productAreas.title_syntheticMonitoring'),
          valid: true,
          content: (
            <PermissionSectionSyntheticMonitoring
              title={t('in-settings:productAreas.title_syntheticMonitoring')}
              accessAllDescription={t('in-settings:PermissionSection.descriptionAccessAll_synthetics')}
              limitedAccessDescription={t('in-settings:PermissionSection.descriptionLimitedAccess_synthetics')}
              addButtonLabel={t('in-settings:PermissionSection.addButton_syntheticTests')}
              roleTooltipText={<Trans i18nKey="in-settings:permissionScope.roleTooltip_synthetics" />}
              observable={() => getAllSyntheticTestsForEntitySelectionWithDefaults({ timeConfig })}
              syntheticCredentials={() => getAllSyntheticCredentialsForEntitySelectionWithDefaults({ timeConfig })}
              icon="lib_synthetic"
              extractId={({ id }) => id}
              extractName={({ name }) => name}
              {...formControlProps}
              {...slideControlProps}
            />
          )
        },
        ...(actionAutomationEnabled
          ? [
              {
                scrollId: '9-automation',
                label: t('in-settings:productAreas.title_automation'),
                title: t('in-settings:productAreas.title_automation'),
                valid: true,
                content: (
                  <PermissionSectionAutomation
                    title={t('in-settings:productAreas.title_automation')}
                    icon="lib_automation"
                    {...formControlProps}
                    {...slideControlProps}
                  />
                )
              }
            ]
          : []),
        {
          scrollId: '10-globalFunctions',
          label: t('in-settings:productAreas.title_global_functions'),
          title: t('in-settings:productAreas.title_global_functions'),
          valid: true,
          content: (
            <PermissionSelection
              title={t('in-settings:productAreas.title_global_functions')}
              productAreas={globalSections}
              icon="lib_actions_settings"
              {...formControlProps}
            />
          )
        },
        ...globalFunctionNavItems
      ]
    : [
        ...navItems,
        ...(actionAutomationEnabled
          ? [
              {
                scrollId: '8-automation',
                label: t('in-settings:productAreas.title_automation'),
                title: t('in-settings:productAreas.title_automation'),
                valid: true,
                content: (
                  <PermissionSectionAutomation
                    title={t('in-settings:productAreas.title_automation')}
                    icon="lib_automation"
                    {...formControlProps}
                    {...slideControlProps}
                  />
                )
              }
            ]
          : []),
        {
          scrollId: '9-globalFunctions',
          label: t('in-settings:productAreas.title_global_functions'),
          title: t('in-settings:productAreas.title_global_functions'),
          valid: true,
          content: (
            <PermissionSelection
              title={t('in-settings:productAreas.title_global_functions')}
              productAreas={globalSections}
              icon="lib_actions_settings"
              {...formControlProps}
            />
          )
        },
        ...globalFunctionNavItems
      ];

  // Filter out areas the user does not have permissions for
  navItems = hasAPlatformAccess ? navItems : navItems.filter(it => it.scrollId !== '7-platforms');

  const isValidActionFilter = () => {
    const limitedPermission = permissionSetField?.value
      ? getScopeFromProductArea(ProductArea.AUTOMATION, permissionSetField.value)
      : ScopedPermissionItem.ACCESS_ALL;
    if (limitedPermission !== 'LIMITED_ACCESS') return true;
    return form.get('actionFilter').hierarchyValid;
  };
  return (
    <ConfigDialog
      showSubSlide={showSubSlide}
      subSlideConfig={subSlideConfig}
      onCloseSubSlide={() => {
        setShowSubSlide(false);
        // Unload/reset sub slide content after transition ends
        setTimeout(() => setSubSlideConfig(undefined), 1000);
      }}
      title={t('in-settings:roleAndAccessScope.dialogTitle', { context })}
      navItems={navItems}
      onClickSave={() => onSave(form)}
      onClickCancel={onCancel}
      disabledSaveButton={
        !form.hierarchyTouched ||
        !permissionSetField?.hierarchyValid ||
        isBlank((form.get('name') as Field<string>).value) ||
        !isValidContributionFilter ||
        !isValidActionFilter()
      }
      noHeader
      noDivider
    />
  );
}
