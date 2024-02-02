/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapFormItems } from 'formalistic';
import React from 'react';

import { Stack, StackItem, Typography } from '@instana/components';

import {
  AreaRole,
  AreaRoleType,
  AreaRoleWithContributor,
  AreaRoleWithContributorType,
  AreaRoleWithCustomType,
  AreaRolesWithContributor,
  ProductAreaType,
  ScopedPermissionItem,
  applicationAdditionalCapabilities
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import AdditionalPermissionSection from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/AdditionalPermissionSection/AdditionalPermissionSection';
import ContributionFilterWrapper from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/ApplicationContributionFilter/ContributionFilterWrapper';
import { ContributorFilterWarning } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/ContributorFilterWarning/ContributorFilterWarning';
import {
  ConfigurationSummary,
  getConfigurationSummaryMsg
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/ConfigurationSummary';
import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import RoleFormGroup from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/RoleFormGroup';
import { applicationContributionFilterEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

interface AccessAllPanelProps<FORM_TYPE extends MapFormItems> extends FormControlProps<FORM_TYPE> {
  entityPermissionKey?: string;
  role?: AreaRoleWithCustomType;
  roleTooltipText?: string | React.ReactElement;
  description: string;
  title?: string;
  onChangeRole?: (role: AreaRoleType | AreaRoleWithContributorType) => void;
  productArea: ProductAreaType;
  contributionFilterConfigured?: boolean;
}

export default function AccessAllPanel<FORM_TYPE extends MapFormItems>({
  role,
  onChangeRole,
  entityPermissionKey,
  roleTooltipText,
  description,
  title,
  productArea,
  contributionFilterConfigured,
  form,
  setForm
}: AccessAllPanelProps<FORM_TYPE>) {
  const isContributor =
    applicationContributionFilterEnabled &&
    entityPermissionKey === 'applicationIds' &&
    role === AreaRoleWithContributor.CONTRIBUTOR;
  const { accessLevelMessage, rolePermissionMessage } = getConfigurationSummaryMsg(
    productArea,
    ScopedPermissionItem.ACCESS_ALL,
    role
  );
  const RoleSelectionSection = () => {
    return (
      <>
        {roleTooltipText && onChangeRole && entityPermissionKey && (
          <RoleFormGroup
            htmlFor={`${entityPermissionKey}-role-select`}
            tooltipText={roleTooltipText}
            value={role}
            defaultRole={AreaRole.VIEWER}
            roleDescription={rolePermissionMessage}
            onChange={onChangeRole}
            {...(entityPermissionKey === 'applicationIds' && applicationContributionFilterEnabled
              ? { options: AreaRolesWithContributor }
              : {})}
          />
        )}
        {entityPermissionKey === 'applicationIds' && (
          <AdditionalPermissionSection form={form} setForm={setForm} capabilities={applicationAdditionalCapabilities} />
        )}
      </>
    );
  };
  return (
    <Stack direction="vertical">
      {applicationContributionFilterEnabled ? (
        <StackItem>
          <ConfigurationSummary accessLevelType={ScopedPermissionItem.ACCESS_ALL} accessLevelMsg={accessLevelMessage}>
            {isContributor && contributionFilterConfigured ? <ContributorFilterWarning /> : null}
            <RoleSelectionSection />
            {isContributor && (
              <ContributionFilterWrapper form={form} setForm={setForm} isContributorRole={isContributor} />
            )}
          </ConfigurationSummary>
        </StackItem>
      ) : (
        <>
          <StackItem>
            <Typography variant="heading-200" component="div">
              {title ?? t('in-settings:permissionScope.description_access_all')}
            </Typography>
            <Typography variant="body-regular" component="div">
              {description}
            </Typography>
          </StackItem>
          <RoleSelectionSection />
        </>
      )}
    </Stack>
  );
}
