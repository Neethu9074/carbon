/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, MapFormItems } from 'formalistic';

import { OrderDirection, PermissionSet, Result, ScopeBinding, GroupPermissionEntity } from '@instana/types';
import { Observable } from '@instana/observables';

import useFetchedStateObservable from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/hooks/useFetchedStateObservable';
import { updateFormField } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import { compareIgnoreCase } from 'in-services/util/string';
import { FetchedState } from 'in-hooks/utils/types';

/**
 * extracts the id from a GroupPermissionEntity
 * @param item current instance
 * @returns id of instance
 */
export const extractId = (item: GroupPermissionEntity) => item.id;

/**
 * extracts the name from a GroupPermissionEntity
 * @param item current instance
 * @returns name of instance
 */
export const extractName = (item: GroupPermissionEntity) => item.name;

/**
 * different types of Kubernetes objects to be handled by
 */
export enum KubernetesEntityType {
  Cluster = 'kubernetesClusterUUIDs',
  Namespace = 'kubernetesNamespaceUIDs'
}

/**
 *  Gets the selected ids from the permission set
 * @param entityType kind to be retrieved
 * @param permissionSetField to be retrieved from
 * @returns selected ids
 */
export function getSelectedEntityIds(entityType: KubernetesEntityType, permissionSetField?: PermissionSet): string[] {
  const preSelectedScopes: ScopeBinding[] = permissionSetField?.[entityType] ?? [];
  return preSelectedScopes.filter(it => it.scopeId).map(it => it.scopeId!!);
}

/**
 * Generates a new permissionSet from the existing with the new ids
 * @param entityType kind of kubernetes object
 * @param permissionSet to be copied
 * @param ids to be added
 * @returns new permissionSet
 */
export function setNewSelected(
  entityType: KubernetesEntityType,
  permissionSet: PermissionSet,
  ids?: string[]
): PermissionSet {
  if (!ids) {
    return { ...permissionSet, [entityType]: [] };
  }
  const keptScopes = permissionSet[entityType].filter(({ scopeId }) => scopeId && ids.includes(scopeId));
  const newScopes = ids
    .filter(id => !keptScopes.some(({ scopeId }) => scopeId === id))
    .map(id => ({ scopeId: id, scopeRoleId: '-1' }));

  return {
    ...permissionSet,
    [entityType]: keptScopes.concat(newScopes)
  };
}

/**
 * Removes one entity from the permissionSet
 * @param entityType kind of entity
 * @param form to be manipulated
 * @param setForm for ssaving
 * @param permissionSet to be copied
 * @param id to be removed
 */
export function removeOneEntity<FORM_TYPE extends MapFormItems>(
  entityType: KubernetesEntityType,
  form: MapForm<FORM_TYPE>,
  setForm: (form: MapForm<FORM_TYPE>) => void,
  permissionSet: PermissionSet,
  id: string
) {
  const entityScopeBindings = permissionSet[entityType].filter(({ scopeId }) => scopeId !== id);
  const updatedForm = updateFormField(
    form,
    'permissionSet',
    { ...permissionSet, [entityType]: entityScopeBindings },
    true
  );
  setForm(updatedForm);
}

/**
 * Type for a KubernetesEntity - allows to add the obsolete flag
 * @property obsolete - means that there is currently no data for this entity (cluster / namespace)
 */
export interface KubernetesEntity extends GroupPermissionEntity {
  obsolete: boolean;
}

/**
 * Fetches and filters the entities provided by be
 * @param observable to fetch the data
 * @param selectedIds to be returned
 * @param orderDirection to sort the data
 * @returns fetched and filtered data
 */
export function useSelectedEntities(
  observable: () => Observable<Result<GroupPermissionEntity[]>>,
  orderDirection: OrderDirection,
  selectedIds: string[] = []
): FetchedState<KubernetesEntity[]> {
  const fetchedState = useFetchedStateObservable(observable);
  const [data, status, ...rest] = fetchedState;

  if (!data || status !== 'resolved') return fetchedState;
  const found = data.filter(({ id }) => selectedIds.includes(id)).map(current => ({ ...current, obsolete: false }));
  const missing = selectedIds
    .filter(id => !found.some(it => it.id === id))
    .map(id => ({ id, name: id, obsolete: true }));
  found.push(...missing);
  found.sort((a, b) => {
    if (orderDirection === 'ASC') return compareIgnoreCase(a.name, b.name);
    return compareIgnoreCase(b.name, a.name);
  });
  return [found, status, ...rest];
}
