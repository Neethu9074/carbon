import React from 'react';

import {
  getEntityHref,
  getEntityIdView,
  teamSettingsAccessControlPermissionSetNew,
  teamSettingsAccessControlPermissionSets
} from 'in-settings/navigation/paths';
import { getPermissionSets, deletePermissionSet } from 'in-api/permissionSets';
import List from 'in-settings/components/List';
import Link from 'in-components/Link';

export default function PermissionSets() {
  return (
    <List
      title="Access Scopes"
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions}
      tableActions={tableActions}
      loadEntities={getPermissionSets}
      initialOrderBy="name"
      labelNew="New Access Scope"
      pathNew={teamSettingsAccessControlPermissionSetNew}
      searchAttributes={['name']}
      getDetailsHref={entity => getEntityHref(teamSettingsAccessControlPermissionSets, entity.id)}
    />
  );
}

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    width: 70,
    getContent(entity) {
      return (
        <Link href$={getEntityIdView(teamSettingsAccessControlPermissionSets, entity.id)} ellipsis>
          {entity.name}
        </Link>
      );
    }
  },
  {
    id: 'appCount',
    label: 'Application Perspectives',
    width: 10,
    getContent(entity) {
      return <span>{entity.applicationIds.length}</span>;
    }
  },
  {
    id: 'clusterCount',
    label: 'Kubernetes Clusters',
    width: 10,
    getContent(entity) {
      return <span>{entity.kubernetesClusterUUIDs ? entity.kubernetesClusterUUIDs.length : 0}</span>;
    }
  },
  {
    id: 'namespaceCount',
    label: 'Kubernetes Namespaces',
    width: 10,
    getContent(entity) {
      return <span>{entity.kubernetesNamespaceUIDs ? entity.kubernetesNamespaceUIDs.length : 0}</span>;
    }
  }
];

const tableActions = {
  delete: {
    deleteEntity: entity => deletePermissionSet(entity.id)
  }
};

function getHeader(totalHits) {
  return totalHits ? `Access Scopes (${totalHits})` : 'Access Scopes';
}

function getEntityName(entity) {
  return `Access Scope "${entity.name}"`;
}
