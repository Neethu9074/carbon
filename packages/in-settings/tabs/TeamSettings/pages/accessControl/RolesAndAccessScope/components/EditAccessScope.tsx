/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm, Field, MapFormItems } from 'formalistic';
import React, { useState } from 'react';

import { PermissionSet, Result } from '@instana/types';
import { useObservable } from '@instana/hooks';

import PermissionSectionSyntheticMonitoring from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/PermissionSectionSyntheticMonitoring';
import PermissionSectionBusinessMonitoring from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/PermissionSectionBusinessMonitoring';
import PermissionSectionInfrastructure from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/PermissionSectionInfrastructure';
import {
  getAreaRoleFromPermissionSet,
  getField,
  updateFormField
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
// @ts-expect-error not migrated to typescript yet
import { isQueryValid } from 'in-applications/creation/components/CreateApplicationQueryBuilder';
import PlatformsEditSelection from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/PlatformsEditSelection';
import {
  AreaRoleWithContributor,
  ProductArea
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { getAllSyntheticTestsForEntitySelectionWithDefaults } from 'in-synthetics/subscriptions/getAllSyntheticTestsForEntitySelection';
import PermissionSelection from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/PermissionSelection';
import { getAllApplicationsForEntitySelectionWithDefaults } from 'in-applications/subscriptions/getAllApplicationsForEntitySelection';
import PermissionSection from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/PermissionSection';
import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import { getAllMobileAppsForEntitySelectionWithDefaults } from 'in-mobile-apps/subscriptions/getAllMobileAppsForEntitySelection';
import GroupNameSection from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/GroupNameSection';
import {
  applicationContributionFilterEnabled,
  syntheticRbacEnabled,
  bizopsRbacEnabled
} from 'in-services/featureFlags';
import HeadingSection from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/HeadingSection';
import { getAllWebsitesForEntitySelectionWithDefaults } from 'in-websites/subscriptions/getAllWebsitesForEntitySelection';
import { amountPlatformAccesses, hasAPlatformAccess, hasKubernetesAccess } from 'in-stores/permission';
import useSubSlideControl, { SlideControlProps } from 'in-settings/hooks/useSubSlideControl';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
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

  if (applicationContributionFilterEnabled) {
    validateContributionFilter();
  }

  const formControlProps: FormControlProps<FORM_TYPE> = {
    form,
    setForm
  };

  const slideControlProps: SlideControlProps<SubSlideConfig> = {
    setSubSlideConfig,
    setShowSubSlide
  };

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
                if (applicationContributionFilterEnabled) {
                  setForm(updateFormField(updatedForm, 'label', value, true));
                } else {
                  setForm(updatedForm);
                }
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
      scrollId: '4.5-bizops',
      label: t('in-settings:productAreas.title_businessMonitoring'),
      title: t('in-settings:productAreas.title_businessMonitoring'),
      valid: true,
      content: (
        <PermissionSectionBusinessMonitoring
          title={t('in-settings:productAreas.title_businessMonitoring')}
          accessAllTitle={t('in-settings:permissionScope.description_access_all')}
          accessAllDescription={t('in-settings:PermissionSection.descriptionAccessAll_bizops')}
          productArea={ProductArea.BIZOPS}
          icon="lib_bizops"
          {...formControlProps}
          {...slideControlProps}
        />
      )
    },
    {
      scrollId: '5-applications',
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
          {...formControlProps}
          {...slideControlProps}
          setValid={setValidContributionFilterName}
          editMode={editMode}
        />
      )
    },
    {
      scrollId: '6-platforms',
      label: platformTitle,
      title: platformTitle,
      valid: true,
      content: <PlatformsEditSelection {...formControlProps} {...slideControlProps} />
    },
    {
      scrollId: '7-infrastructure',
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

  navItems = syntheticRbacEnabled
    ? [
        ...navItems,
        {
          scrollId: '8-synthetics',
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
              icon="lib_synthetic"
              extractId={({ id }) => id}
              extractName={({ name }) => name}
              {...formControlProps}
              {...slideControlProps}
            />
          )
        },
        {
          scrollId: '10-eventsAndAlerts',
          label: t('in-settings:productAreas.title_events_and_alerts'),
          title: t('in-settings:productAreas.title_events_and_alerts'),
          valid: true,
          content: (
            <PermissionSelection
              title={t('in-settings:productAreas.title_events_and_alerts')}
              description={t('in-settings:PermissionSection.description_events_and_alerts')}
              productAreas={[ProductArea.EVENT]}
              icon="lib_events_inverted"
              {...formControlProps}
              {...slideControlProps}
            />
          )
        },
        {
          scrollId: '11-globalFunctions',
          label: t('in-settings:productAreas.title_global_functions'),
          title: t('in-settings:productAreas.title_global_functions'),
          valid: true,
          content: (
            <PermissionSelection
              title={t('in-settings:productAreas.title_global_functions')}
              productAreas={[
                ProductArea.MIXED,
                ProductArea.LOGS,
                ProductArea.DASHBOARD,
                ProductArea.AUTOMATION,
                ProductArea.AGENTS,
                ProductArea.ACCESS_CONTROL
              ]}
              icon="lib_actions_settings"
              {...formControlProps}
              {...slideControlProps}
            />
          )
        }
      ]
    : [
        ...navItems,
        {
          scrollId: '9-eventsAndAlerts',
          label: t('in-settings:productAreas.title_events_and_alerts'),
          title: t('in-settings:productAreas.title_events_and_alerts'),
          valid: true,
          content: (
            <PermissionSelection
              title={t('in-settings:productAreas.title_events_and_alerts')}
              description={t('in-settings:PermissionSection.description_events_and_alerts')}
              productAreas={[ProductArea.EVENT]}
              icon="lib_events_inverted"
              {...formControlProps}
              {...slideControlProps}
            />
          )
        },
        {
          scrollId: '10-globalFunctions',
          label: t('in-settings:productAreas.title_global_functions'),
          title: t('in-settings:productAreas.title_global_functions'),
          valid: true,
          content: (
            <PermissionSelection
              title={t('in-settings:productAreas.title_global_functions')}
              productAreas={[
                ProductArea.MIXED,
                ProductArea.LOGS,
                ProductArea.DASHBOARD,
                ProductArea.SYNTHETICS,
                ProductArea.AUTOMATION,
                ProductArea.AGENTS,
                ProductArea.ACCESS_CONTROL
              ]}
              icon="lib_actions_settings"
              {...formControlProps}
              {...slideControlProps}
            />
          )
        }
      ];

  // Filter out areas the user does not have permissions for
  navItems = bizopsRbacEnabled ? navItems : navItems.filter(it => it.scrollId !== '4.5-bizops');
  navItems = hasAPlatformAccess ? navItems : navItems.filter(it => it.scrollId !== '6-platforms');

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
        !isValidContributionFilter
      }
      noHeader
      noDivider
    />
  );
}
