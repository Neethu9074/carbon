/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { PermissionSetWithRoles, ScopeBinding, WebsiteConfiguration } from '@instana/types';
import { Button, Stack, StackItem, SvgIcon, Typography } from '@instana/components';
import { useTheme } from '@instana/hooks';

import { WebsitePermissionSectionProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/WebsitePermissionSection/WebsitePermissionSection';
import useWebsiteConfigurations from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/WebsitePermissionSection/useWebsiteConfigurations';
import SelectWebsitesForm from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/WebsitePermissionSection/SelectWebsitesForm';
import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import RoleFormGroup from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/RoleFormGroup';
import { getField, updateFormField } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import EntityTable from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/EntityTable';
import { AreaRoleType } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import Divider from 'in-components/workspace/Divider/Divider';
import { FetchedState } from 'in-hooks/utils/types';
import { noop } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

interface WebsiteLimitedAccessPanelProps
  extends FormControlProps,
    Pick<WebsitePermissionSectionProps, 'setSubSlideConfig' | 'setShowSubSlide'> {
  role?: AreaRoleType;
  onChangeRole: (role: AreaRoleType) => void;
}

export default function WebsiteLimitedAccessPanel({
  role,
  form,
  setForm,
  onChangeRole,
  setShowSubSlide,
  setSubSlideConfig
}: WebsiteLimitedAccessPanelProps) {
  const theme = useTheme();
  const permissionSetField = getField<PermissionSetWithRoles>(form, 'permissionSet');
  const permissionWebsites = permissionSetField?.value.websiteIds ?? [];

  const permissionWebsiteIds = useWebsiteIds(permissionWebsites);
  const selectedWebsites = useSelectedWebsiteConfigurations(permissionWebsiteIds);

  const updatePermissionSet = (permissionSet: PermissionSetWithRoles) => {
    const updatedForm = updateFormField(form, 'permissionSet', permissionSet, true);
    setForm(updatedForm);
  };

  const updateWebsiteIds = (websiteIds?: string[]) => {
    const permissionSet = permissionSetField?.value;
    if (!permissionSet) return;

    if (!websiteIds) {
      return updatePermissionSet({ ...permissionSet, websiteIds: [] });
    }

    const keepedScopes = permissionWebsites.filter(({ scopeId }) => scopeId && websiteIds.includes(scopeId));
    const newScopes = websiteIds.map(id => ({ scopeId: id, scopeRoleId: '-1' }));

    updatePermissionSet({
      ...permissionSet,
      websiteIds: keepedScopes.concat(newScopes)
    });
  };

  const removeWebsiteFromPermissionSet = (websiteId: string) => {
    const permissionSet = permissionSetField?.value;
    if (!permissionSet) return;

    const websiteIds = permissionWebsites.filter(({ scopeId }) => scopeId !== websiteId);
    updatePermissionSet({ ...permissionSet, websiteIds });
  };

  const columnDefinition: Array<ColumnDefinition<WebsiteConfiguration>> = [
    {
      id: 'name',
      label: t('in-settings:selectWebsitesDialog.nameColumnHead'),
      getContent({ name }) {
        return <>{name}</>;
      }
    },
    {
      id: 'action',
      label: '',
      useMinimumAmountOfHorizontalSpace: true,
      getContent({ id, name }) {
        return (
          <SvgIcon
            aria-label={t('in-settings:websitePermissionSection.deleteButton', { name })}
            onClick={() => removeWebsiteFromPermissionSet(id)}
            type="lib_openclose_remove_circle_outline"
            color={theme.ids.color.option.teal[500]}
          />
        );
      }
    }
  ];

  return (
    <Stack direction="vertical">
      <StackItem>
        <Typography variant="heading-200" component="div">
          {t('in-settings:permissionScope.selection_limited_access')}
        </Typography>
        <Typography variant="body-regular" component="div">
          {t('in-settings:websitePermissionSection.description_limited_access')}
        </Typography>
      </StackItem>
      <RoleFormGroup
        htmlFor="website-role-select"
        tooltipText={t('in-settings:permissionScope.roleTooltip', { context: 'websites' })}
        defaultRole={role}
        onChange={onChangeRole}
      />
      <Divider />
      <StackItem>
        <Button
          kind="action"
          onClick={() => {
            setSubSlideConfig({
              title: t('in-settings:selectWebsitesDialog.title'),
              content: (
                <SelectWebsitesForm
                  preselectedWebsiteIds={permissionWebsiteIds}
                  onClickCancel={() => setShowSubSlide(false)}
                  onClickSave={websiteIds => {
                    updateWebsiteIds(websiteIds);
                    setShowSubSlide(false);
                  }}
                />
              )
            });
            setShowSubSlide(true);
          }}
          icon="lib_openclose_add_circle_outline"
        >
          {t('in-settings:websitePermissionSection.addButton')}
        </Button>
      </StackItem>
      <EntityTable
        fetchedConfigState={selectedWebsites}
        query=""
        orderBy="name"
        orderDirection="ASC"
        onClickItem={noop}
        columnDefinition={columnDefinition}
      />
    </Stack>
  );
}

function useWebsiteIds(websites: ScopeBinding[]): Array<string> {
  return websites.filter(({ scopeId }) => scopeId !== undefined).map<string>(({ scopeId }) => scopeId!);
}

function useSelectedWebsiteConfigurations(selectedWebsiteIds: string[]): FetchedState<WebsiteConfiguration[]> {
  const fetchedState = useWebsiteConfigurations();
  const [data, status, ...rest] = fetchedState;

  if (!data || status !== 'resolved') return fetchedState;

  return [data?.filter(({ id }) => selectedWebsiteIds.includes(id)), status, ...rest];
}
