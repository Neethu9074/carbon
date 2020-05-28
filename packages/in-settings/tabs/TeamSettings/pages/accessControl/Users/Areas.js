import { just } from 'reactive-observables';
import React, { useState } from 'react';

import {
  mapApplications,
  mapKubernetesClusters,
  mapKubernetesNamespaces,
  mapWebsites,
  mapMobileApps,
  mapInfraDfq
} from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/permissionSetResultFilter';
import { iconColumn, labelColumn } from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/AreaColumnDefinitions';
import { getKubernetesNamespacesAsResultObservable } from 'in-settings/tabs/TeamSettings/api/kubernetesNamespaces';
import { getKubernetesClustersAsResultObservable } from 'in-settings/tabs/TeamSettings/api/kubernetesClusters';
import { getMobileAppsAsResultObservable } from 'in-settings/tabs/TeamSettings/api/mobileApps';
import { getWebsitesAsResultObservable } from 'in-settings/tabs/TeamSettings/api/websites';
import { ListInsideACardRenderer } from 'in-settings/components/ApiList/renderer/renderer';
import { getGroupsAsResultObservable } from 'in-settings/tabs/TeamSettings/api/groups';
import { getApplicationConfigsAsResultObservable } from 'in-api/applicationConfigs';
import { success, combineResultObservables } from 'in-services/util/result';
import { getPermissionSetsAsResultObservable } from 'in-api/permissionSets';
import { ColumnizedContent, Li, Ul } from 'in-new-components/lists/List';
import { hasError, isLoading } from 'in-services/util/result';
import KeyValue from 'in-new-components/lists/KeyValue';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ userId }) => ({
    ...combineResultObservables({
      applications: getApplicationConfigsAsResultObservable(),
      K8sClusters: getKubernetesClustersAsResultObservable(),
      K8sNamespaces: getKubernetesNamespacesAsResultObservable(),
      websites: getWebsitesAsResultObservable(),
      mobileApps: getMobileAppsAsResultObservable()
    }),
    permissionSetsToGroupResult: getGroupsAsResultObservable().flatMap(groupsResult => {
      if (hasError(groupsResult) || isLoading(groupsResult)) {
        return just(groupsResult);
      }

      const groups = groupsResult.data.filter(group => containsUser(group, userId));
      const permissionSetIdsToGroupsMap = getPermissionSetIdsToGroupsMap(groups);

      return getPermissionSetsAsResultObservable().map(permissionSetsResult => {
        if (hasError(permissionSetsResult) || isLoading(permissionSetsResult)) {
          return permissionSetsResult;
        }

        const permissionSets = permissionSetsResult.data
          .filter(permissionSet => permissionSetIdsToGroupsMap.has(permissionSet.id))
          .map(permissionSet => ({
            group: permissionSetIdsToGroupsMap.get(permissionSet.id),
            permissionSet
          }));
        return success(permissionSets);
      });
    })
  }),
  function Areas({ result, permissionSetsToGroupResult }) {
    const [page, setPage] = useState(1);

    let itemsResult = null;
    if (isLoading(permissionSetsToGroupResult) || hasError(permissionSetsToGroupResult)) {
      itemsResult = permissionSetsToGroupResult;
    } else if (isLoading(result) || hasError(result)) {
      itemsResult = result;
    } else {
      itemsResult = success(collectIdsFromPermissionSets(permissionSetsToGroupResult.data, result));
    }

    return (
      <ListInsideACardRenderer
        itemName="Area"
        page={page}
        setPage={setPage}
        pageSize={5}
        ListRenderer={ListRenderer}
        itemsResult={itemsResult}
      />
    );
  }
);

function collectIdsFromPermissionSets(permissionSetsToGroups, result) {
  let allIds = [];

  const values = permissionSetsToGroups.values();
  for (const entry of values) {
    const ids = collectIds(entry.permissionSet, entry.group, result);
    allIds = [...allIds, ...ids];
  }

  return allIds;
}

function collectIds(permissionSet, group, result) {
  return [
    ...mapApplications(result.applications, permissionSet.applicationIds, () => ({ group })),
    ...mapKubernetesClusters(result.K8sClusters, permissionSet.kubernetesClusterUUIDs, () => ({ group })),
    ...mapKubernetesNamespaces(result.K8sNamespaces, permissionSet.kubernetesNamespaceUIDs, () => ({ group })),
    ...mapWebsites(result.websites, permissionSet.websiteIds, () => ({ group })),
    ...mapMobileApps(result.mobileApps, permissionSet.mobileAppIds, () => ({ group })),
    ...mapInfraDfq(permissionSet.infraDfqFilter, () => ({ group }))
  ].filter(Boolean);
}

function ListRenderer({ items }) {
  return (
    <Ul>
      {items.map(item => (
        <Li key={item.id}>
          <ColumnizedContent columnDefinitions={columnDefinitions} item={item} />
        </Li>
      ))}
    </Ul>
  );
}

const columnDefinitions = [
  iconColumn,
  labelColumn,
  {
    width: '15rem',
    getContent({ item }) {
      return <KeyValue label="Group" customValue={item.group.name} />;
    }
  }
];

function containsUser(group, userId) {
  for (let i = 0; i < group.members.length; i++) {
    if (userId === group.members[i].userId) {
      return true;
    }
  }
  return false;
}

function getPermissionSetIdsToGroupsMap(groups) {
  const map = new Map();
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    map.set(group.permissions[0].id, group);
  }
  return map;
}
