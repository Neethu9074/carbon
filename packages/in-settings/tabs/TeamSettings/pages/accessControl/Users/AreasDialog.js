import { just } from 'reactive-observables';
import React from 'react';

import AreasList from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/AreasList';
import { getGroupsAsResultObservable } from 'in-settings/tabs/TeamSettings/api/groups';
import { getPermissionSetsAsResultObservable } from 'in-api/permissionSets';
import { hasError, isLoading } from 'in-services/util/result';
import { close } from 'in-components/DialogPresenter/store';
import { getResultForData } from 'in-services/util/result';
import Dialog from 'in-new-components/Dialog';
import connectTo from 'in-hoc/connectTo';

import locals from './AreasDialog.mless';

export default connectTo(
  ({ userId }) => ({
    entitiesResult: getGroupsAsResultObservable().flatMap(groupResult => {
      if (hasError(groupResult) || isLoading(groupResult)) {
        return just(groupResult);
      }

      const accessScopeIdsByGroup = getAccessscopeIdsByGroups(userId, groupResult);
      return getPermissionSetsAsResultObservable().map(permissionSetsResult => {
        if (hasError(permissionSetsResult) || isLoading(permissionSetsResult)) {
          return permissionSetsResult;
        }

        return getResultForData(
          collectEntities(
            permissionSetsResult.data.filter(({ id }) => accessScopeIdsByGroup.has(id)),
            accessScopeIdsByGroup
          )
        );
      });
    })
  }),
  function Areas({ entitiesResult }) {
    return (
      <Dialog className={locals.dialog} title="User areas" onClose={close}>
        <AreasList areasResult={entitiesResult} />
      </Dialog>
    );
  }
);

function collectEntities(accessScopes, accessScopeIdsByGroup) {
  const entities = [];

  for (let i = 0; i < accessScopes.length; i++) {
    const accessScope = accessScopes[i];
    const groups = accessScopeIdsByGroup.get(accessScope.id);
    addIds(accessScope.applicationIds, entities, 'lib_application', 'Application', groups);
    addIds(accessScope.kubernetesClusterUUIDs, entities, 'lib_kubernetes_cluster', 'Kubernetes Cluster', groups);
    addIds(accessScope.kubernetesNamespaceUIDs, entities, 'lib_kubernetes_namespace', 'Kubernetes Namespace', groups);
    addIds(accessScope.mobileAppIds, entities, 'lib_mobile_app', 'Mobile App', groups);
    addIds(accessScope.websiteIds, entities, 'lib_website', 'Website', groups);
    if (accessScope.infraDfqFilter) {
      entities.push({
        label: accessScope.infraDfqFilter,
        icon: 'lib_actions_search',
        subLabel: 'Infrastructure dynamic focus query',
        inheritFromGroups: groups
      });
    }
  }
  return entities;
}

function addIds(ids, list, icon, subLabel, inheritFromGroups) {
  for (let i = 0; i < ids.length; i++) {
    list.push({ id: ids[i], icon, subLabel, inheritFromGroups });
  }
}

function groupContainsUser(group, userId) {
  for (let iM = 0; iM < group.members.length; iM++) {
    const member = group.members[iM];
    if (member.userId === userId) {
      return true;
    }
  }
  return false;
}

function getAccessscopeIdsByGroups(userId, groupResult) {
  const accessScopeIds = new Map();
  for (let i = 0; i < groupResult.data.length; i++) {
    const group = groupResult.data[i];
    if (!groupContainsUser(group, userId)) {
      continue;
    }
    for (let j = 0; j < group.permissions.length; j++) {
      const id = group.permissions[j].id;
      if (accessScopeIds.has(id)) {
        accessScopeIds.get(id).push(group);
      } else {
        accessScopeIds.set(id, [group]);
      }
    }
  }

  return accessScopeIds;
}
