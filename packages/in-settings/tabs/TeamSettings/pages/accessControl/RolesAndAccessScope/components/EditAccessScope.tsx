/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';
import { MapForm } from 'formalistic';

import PermissionSection from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/PermissionSection';
import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import GroupNameSection from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/GroupNameSection';
import HeadingSection from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/HeadingSection';
import { getField, updateFormField } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import { ProductArea } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { getApplicationConfigsAsResultObservable } from '../../../../../../../in-api/applicationConfigs';
import useSubSlideControl, { SlideControlProps } from 'in-settings/hooks/useSubSlideControl';
import ConfigDialog, { SubSlideConfig } from 'in-settings/components/ConfigDialog';
import { getMobileAppConfigurations } from 'in-mobile-apps/api/mobileApps';
import { getWebsiteConfigurations } from 'in-websites/api/websites';
import { t } from 'in-i18n';

interface EditAccessScopeDialogProps extends FormControlProps {
  editMode?: boolean;
  onSave: (form: MapForm) => void;
  onCancel: VoidFunction;
}

export default function EditAccessScopeDialog({
  form: originForm,
  setForm: _originSetForm,
  onSave,
  onCancel,
  editMode
}: EditAccessScopeDialogProps) {
  const [form, setForm] = useState(originForm);
  const { subSlideConfig, setSubSlideConfig, showSubSlide, setShowSubSlide } = useSubSlideControl();
  const context = editMode ? 'edit' : 'create';

  const groupNameField = getField<string>(form, 'name');

  const formControlProps: FormControlProps = {
    form,
    setForm
  };

  const slideControlProps: SlideControlProps<SubSlideConfig> = {
    setSubSlideConfig,
    setShowSubSlide
  };

  const firstItem = !editMode
    ? [
        {
          scrollId: '1-group-name',
          label: 'Group name',
          title: 'Group name',
          valid: true,
          content: (
            <GroupNameSection
              value={groupNameField?.value}
              setValue={(value: string) => setForm(updateFormField(form, 'name', value))}
            />
          )
        }
      ]
    : [];

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
      navItems={[
        ...firstItem,
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
          label: 'Websites',
          title: 'Websites',
          valid: true,
          content: (
            <PermissionSection
              title={t('in-settings:PermissionSection.title_websites')}
              accessAllDescription={t('in-settings:PermissionSection.descriptionAccessAll_websites')}
              limitedAccessDescription={t('in-settings:PermissionSection.descriptionLimitedAccess_websites')}
              addButtonLabel={t('in-settings:PermissionSection.addButton_websites')}
              roleTooltipText={t('in-settings:permissionScope.roleTooltip_websites')}
              entityPermissionKey="websiteIds"
              observable={getWebsiteConfigurations}
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
          label: t('in-settings:PermissionSection.title_mobileApps'),
          title: t('in-settings:PermissionSection.title_mobileApps'),
          valid: true,
          content: (
            <PermissionSection
              title={t('in-settings:PermissionSection.title_mobileApps')}
              accessAllDescription={t('in-settings:PermissionSection.descriptionAccessAll_mobileApps')}
              limitedAccessDescription={t('in-settings:PermissionSection.descriptionLimitedAccess_mobileApps')}
              addButtonLabel={t('in-settings:PermissionSection.addButton_mobileApps')}
              roleTooltipText={t('in-settings:permissionScope.roleTooltip_mobileApps')}
              entityPermissionKey="mobileAppIds"
              observable={getMobileAppConfigurations}
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
          scrollId: '5-applications',
          label: t('in-settings:PermissionSection.title_applications'),
          title: t('in-settings:PermissionSection.title_applications'),
          valid: true,
          content: (
            <PermissionSection
              title={t('in-settings:PermissionSection.title_applications')}
              accessAllDescription={t('in-settings:PermissionSection.descriptionAccessAll_applications')}
              limitedAccessDescription={t('in-settings:PermissionSection.descriptionLimitedAccess_applications')}
              addButtonLabel={t('in-settings:PermissionSection.addButton_applications')}
              roleTooltipText={t('in-settings:permissionScope.roleTooltip_applications')}
              entityPermissionKey="applicationIds"
              observable={getApplicationConfigsAsResultObservable}
              productArea={ProductArea.APPLICATION}
              icon="lib_application"
              extractId={({ id }) => id}
              extractName={({ label }) => label}
              {...formControlProps}
              {...slideControlProps}
            />
          )
        }
      ]}
      onClickSave={() => onSave(form)}
      onClickCancel={onCancel}
      disabledSaveButton={!form.hierarchyTouched}
      noHeader
      noDivider
    />
  );
}
