/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapFormItems } from 'formalistic';
import React from 'react';

import { Stack, StackItem } from '@instana/components';

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

interface AccessAllPanelProps<FORM_TYPE extends MapFormItems> extends FormControlProps<FORM_TYPE> {
  entityPermissionKey?: string;
  role?: AreaRoleWithCustomType;
  roleTooltipText?: string | React.ReactElement;
  onChangeRole?: (role: AreaRoleType | AreaRoleWithContributorType) => void;
  productArea: ProductAreaType;
  contributionFilterConfigured?: boolean;
  setValid?: (isValid: boolean) => void;
  editMode?: boolean;
}

export default function AccessAllPanel<FORM_TYPE extends MapFormItems>({
  role,
  onChangeRole,
  entityPermissionKey,
  roleTooltipText,
  productArea,
  contributionFilterConfigured,
  form,
  setForm,
  setValid,
  editMode
}: AccessAllPanelProps<FORM_TYPE>) {
  const isContributor = entityPermissionKey === 'applicationIds' && role === AreaRoleWithContributor.CONTRIBUTOR;
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
            value={role}
            defaultRole={AreaRole.VIEWER}
            roleDescription={rolePermissionMessage}
            onChange={onChangeRole}
            {...(entityPermissionKey === 'applicationIds' ? { options: AreaRolesWithContributor } : {})}
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
      <StackItem>
        <ConfigurationSummary accessLevelType={ScopedPermissionItem.ACCESS_ALL} accessLevelMsg={accessLevelMessage}>
          {isContributor && contributionFilterConfigured ? <ContributorFilterWarning /> : null}
          <RoleSelectionSection />
          {isContributor && (
            <ContributionFilterWrapper
              form={form}
              setForm={setForm}
              isContributorRole={isContributor}
              setValid={setValid}
              editMode={editMode}
            />
          )}
        </ConfigurationSummary>
      </StackItem>
    </Stack>
  );
}
