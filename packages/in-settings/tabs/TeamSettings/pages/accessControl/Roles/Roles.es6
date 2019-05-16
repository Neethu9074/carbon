import React from 'react';

import {
  getEntityHref,
  getEntityIdView,
  teamSettingsAccessControlRoleNew,
  teamSettingsAccessControlRoles
} from 'in-settings/navigation/paths';
import WithSubscript from 'in-settings/components/WithSubscript';
import { getRolesMutable, deleteRole } from 'in-api/roles';
import { isRbacEnabled } from 'in-services/featureFlags';
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
    width: 100,
    getContent(entity) {
      return (
        <WithSubscript subscript={isRbacEnabled && entity.restrictedAccess ? 'Limited Access' : ''}>
          <Link href$={getEntityIdView(teamSettingsAccessControlRoles, entity.id)} ellipsis>
            <span>{entity.name}</span>
          </Link>
        </WithSubscript>
      );
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
  return totalHits ? `Roles (${totalHits})` : 'Roles';
}

function getEntityName(entity) {
  return `role "${entity.name}"`;
}

function isProtectedRole(role) {
  // some roles are protected, which is signaled by having a numerical ID < 0
  return role && role.id < 0;
}
