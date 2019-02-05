import React from 'react';

import {
  getEntityHref,
  getEntityIdView,
  teamSettingsAccessControlRoleNew,
  teamSettingsAccessControlRoles
} from 'in-settings/navigation/paths';
import { getRolesMutable, deleteRole } from 'in-api/roles';
import List from 'in-settings/components/List';
import Link from 'in-components/Link';

export default function Roles() {
  return (
    <List
      title="Roles"
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions}
      tableActions={tableActions}
      loadEntities={getRolesMutable}
      initialOrderBy="name"
      labelNew="New Role"
      pathNew={teamSettingsAccessControlRoleNew}
      searchAttributes={['name']}
      getDetailsHref={entity => getEntityHref(teamSettingsAccessControlRoles, entity.id)}
    />
  );
}

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    getContent(entity) {
      return <Link href$={getEntityIdView(teamSettingsAccessControlRoles, entity.id)}>{entity.name}</Link>;
    }
  }
];

const tableActions = {
  delete: {
    deleteEntity: entity => deleteRole(entity.id),
    deleteProtection: isProtectedRole
  }
};

function getHeader(totalHits) {
  return totalHits ? `Existing Roles (${totalHits})` : 'Existing Roles';
}

function getEntityName(entity) {
  return `role "${entity.name}"`;
}

function isProtectedRole(role) {
  // some roles are protected, which is signaled by having a numerical ID < 16
  return role && role.id < 0;
}
