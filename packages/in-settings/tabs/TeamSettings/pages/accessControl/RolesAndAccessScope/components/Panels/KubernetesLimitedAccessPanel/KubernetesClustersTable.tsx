/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { PermissionSetWithRoles, ScopeBinding } from '@instana/types';
import { SvgIcon } from '@instana/components';
import { useTheme } from '@instana/hooks';

import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import EntityTable from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/EntityTable';
import { getField, updateFormField } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { compareIgnoreCase } from 'in-services/util/string';
import { FetchedState } from 'in-hooks/utils/types';
import { noop } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

/**
 * Component to display (currently) selected clusters in the edit view
 * @param FormControlProps to remove currently selected / find out which ones are selected
 * @returns Component
 */
export default function _KubernetesClustersTable({ form, setForm }: FormControlProps) {
  // the permissionSet already contains selected cluster 'names' as scopeIds
  const permissionSetField = getField<PermissionSetWithRoles>(form, 'permissionSet');
  const preSelectedClusters: ScopeBinding[] = permissionSetField?.value?.kubernetesClusterUUIDs ?? [];
  const selectedClustersIds: string[] = preSelectedClusters
    .filter(it => it.scopeId)
    .map(it => it.scopeId!!)
    .sort((a, b) => compareIgnoreCase(a, b));
  // needs to be a FetchedState, as the EntityTable always expects FetchedStates
  const selectedClusters: FetchedState<string[]> = [selectedClustersIds, 'resolved', [], { loading: false }];

  /**
   * Removes access of a cluster
   * @param id to be removed
   */
  const removeClusterAccess = (id: string) => {
    const permissionSet = permissionSetField?.value;
    if (!permissionSet) return;

    const entityScopeBindings = preSelectedClusters.filter(({ scopeId }) => scopeId !== id);
    const updatedForm = updateFormField(
      form,
      'permissionSet',
      { ...permissionSet, ['kubernetesClusterUUIDs']: entityScopeBindings },
      true
    );
    setForm(updatedForm);
  };

  const theme = useTheme();
  const columnDefinition: Array<ColumnDefinition<string>> = [
    {
      id: 'name',
      label: t('in-settings:selectEntityDialog.nameColumnHead'),
      getContent(id) {
        return <>{id}</>;
      }
    },
    {
      id: 'action',
      label: '',
      useMinimumAmountOfHorizontalSpace: true,
      getContent(id) {
        return (
          <SvgIcon
            aria-label={t('in-settings:PermissionSection.deleteButton', { name: id })}
            onClick={() => removeClusterAccess(id)}
            type="lib_openclose_remove_circle_outline"
            color={theme.ids.color.option.teal[500]}
          />
        );
      }
    }
  ];

  return (
    <EntityTable
      fetchedConfigState={selectedClusters}
      query=""
      orderBy="name"
      orderDirection="ASC"
      onClickItem={noop}
      columnDefinition={columnDefinition}
    />
  );
}
