/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  KubernetesNamespace,
  PaginatedResult,
  PermissionSetWithRoles,
  Result,
  ScopeBinding,
  TimeConfig
} from '@instana/types';
import { useObservable, useTheme } from '@instana/hooks';
import { Observable } from '@instana/observables';
import { SvgIcon } from '@instana/components';

import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import EntityTable from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/EntityTable';
import { getField, updateFormField } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import { getKubernetesNamespacesWithDefaults } from 'in-kubernetes/subscriptions/getKubernetesNamespaces';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { compareIgnoreCase } from 'in-services/util/string';
import { FetchedState } from 'in-hooks/utils/types';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { noop } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

/**
 * Internal model for a namespace
 */
interface Namespace {
  uid: string;
  label: string;
}

/**
 * Fetches, filters, parses and maps the kubernetes namespaces
 * @param timeConfig
 * @param selectedIds
 * @returns
 */
function useSelectedEntities(timeConfig: TimeConfig, selectedIds: string[] = []): FetchedState<Namespace[]> {
  const observable: () => Observable<Result<PaginatedResult<KubernetesNamespace>>> = () =>
    getKubernetesNamespacesWithDefaults({ pageSize: 200, timeConfig });
  const result = useObservable(observable, [getKubernetesNamespacesWithDefaults]);
  const fetchedState = resultToFetchedStateResponse(result);
  const [data, status, ...rest] = fetchedState;

  if (!data || status !== 'resolved') return fetchedState;

  const filteredData = data.items
    .filter(it => selectedIds.includes(it.id))
    .map(it => ({ uid: it.id, label: it.label }))
    .sort((a, b) => compareIgnoreCase(a.label, b.label));
  return [filteredData, status, ...rest];
}

/**
 * Table displaying the currently selected Kubernetes namespaces
 * @param param0 FormControlProps to get current selection / adjust
 * @returns current instance
 */
export default function _KubernetesNamespacesTable({ form, setForm }: FormControlProps) {
  // retrieve data from permissionSet
  const permissionSetField = getField<PermissionSetWithRoles>(form, 'permissionSet');
  const preSelectedNamespaces: ScopeBinding[] = permissionSetField?.value?.kubernetesNamespaceUIDs ?? [];
  const selectedNamespaceIds: string[] = preSelectedNamespaces.filter(it => it.scopeId).map(it => it.scopeId!!);

  // fetch detailed namespace info
  const timeConfig = useTimeConfig();
  const selectedNamespaces = useSelectedEntities(timeConfig, selectedNamespaceIds);

  /**
   * Allows to remove the namespace access
   * @param uid to be removed
   */
  const removeNamespaceAccess = (uid: string) => {
    const permissionSet = permissionSetField?.value;
    if (!permissionSet) return;

    const entityScopeBindings = preSelectedNamespaces.filter(({ scopeId }) => scopeId !== uid);
    const updatedForm = updateFormField(
      form,
      'permissionSet',
      { ...permissionSet, ['kubernetesNamespaceUIDs']: entityScopeBindings },
      true
    );
    setForm(updatedForm);
  };

  // Column definition
  const theme = useTheme();
  const columnDefinition: Array<ColumnDefinition<Namespace>> = [
    {
      id: 'name',
      label: t('in-settings:selectEntityDialog.nameColumnHead'),
      getContent(it) {
        return <>{it.label}</>;
      }
    },
    {
      id: 'action',
      label: '',
      useMinimumAmountOfHorizontalSpace: true,
      getContent(it) {
        return (
          <SvgIcon
            aria-label={t('in-settings:PermissionSection.deleteButton', { name: it.label })}
            onClick={() => removeNamespaceAccess(it.uid)}
            type="lib_openclose_remove_circle_outline"
            color={theme.ids.color.option.teal[500]}
          />
        );
      }
    }
  ];
  // Actual table
  return (
    <EntityTable
      fetchedConfigState={selectedNamespaces}
      query=""
      orderBy="name"
      orderDirection="ASC"
      onClickItem={noop}
      columnDefinition={columnDefinition}
    />
  );
}
