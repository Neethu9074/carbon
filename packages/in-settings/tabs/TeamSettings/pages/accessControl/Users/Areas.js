/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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
import { ListInsideACardRenderer } from 'in-settings/components/ApiList/renderer/renderer';
import { getGroupsOfASingleUser } from 'in-settings/tabs/TeamSettings/api/groups';
import { ColumnizedContent, Li, Ul } from 'in-new-components/lists/List';
import { hasError, isLoading } from 'in-services/util/result';
import KeyValue from 'in-new-components/lists/KeyValue';
import { success } from 'in-services/util/result';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ userEmail }) => ({
    permissionSetsToGroupResult: getGroupsOfASingleUser(userEmail)
  }),
  function Areas({ permissionSetsToGroupResult }) {
    const [page, setPage] = useState(1);

    let itemsResult = null;
    if (isLoading(permissionSetsToGroupResult) || hasError(permissionSetsToGroupResult)) {
      itemsResult = permissionSetsToGroupResult;
    } else {
      itemsResult = success(collectIdsFromPermissionSets(permissionSetsToGroupResult.data));
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

function collectIdsFromPermissionSets(permissionSetsToGroups) {
  let allIds = [];

  const values = permissionSetsToGroups.values();
  for (const entry of values) {
    const ids = collectIds(entry);
    allIds = [...allIds, ...ids];
  }

  return allIds;
}

function collectIds(group) {
  return [
    ...mapApplications(group.permissionSet.applicationIds, () => ({ group })),
    ...mapKubernetesClusters(group.permissionSet.kubernetesClusterUUIDs, () => ({ group })),
    ...mapKubernetesNamespaces(group.permissionSet.kubernetesNamespaceUIDs, () => ({ group })),
    ...mapWebsites(group.permissionSet.websiteIds, () => ({ group })),
    ...mapMobileApps(group.permissionSet.mobileAppIds, () => ({ group })),
    mapInfraDfq(group.permissionSet.infraDfqFilter, () => ({ group }))
  ].filter(Boolean);
}

function ListRenderer({ items }) {
  return (
    <Ul>
      {items.map((item, i) => (
        <Li key={i}>
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
