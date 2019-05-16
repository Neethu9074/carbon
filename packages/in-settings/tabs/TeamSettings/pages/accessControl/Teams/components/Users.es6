import { compose } from 'recompose';
import React from 'react';

import List, { leftHeaderWithSelectAll } from 'in-settings/components/List';
import WithSubscript from 'in-settings/components/WithSubscript';
import { isRbacEnabled } from 'in-services/featureFlags';
import { getRolesMutable } from 'in-api/roles';
import Gravatar from 'in-components/Gravatar';
import { getUsers } from 'in-api/users';
import connectTo from 'in-hoc/connectTo';

import locals from './Users.mless';

export default compose(
  connectTo({
    roles: getRolesMutable()
  })
)(Users);

function Users({
  roles,
  setTitle = true,
  scrollWrapperClassName,
  tableActions = defaultTableActions,
  loadEntities,
  noDataMessage,
  hiddenIds,
  pageSize = 20,
  rightHeader,
  isSearchable = true,
  onRowClick,
  hasRowNavigation = false,
  inSelectListDialog = false,
  getHeader = defaultGetHeader(inSelectListDialog, tableActions)
}) {
  return (
    <List
      title={setTitle ? 'Users' : null}
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions(roles, hasRowNavigation)}
      scrollWrapperClassName={scrollWrapperClassName}
      tableActions={tableActions}
      loadEntities={loadEntities ? loadEntities : getUsers}
      noDataMessage={noDataMessage}
      pageSize={pageSize}
      initialOrderBy="fullName"
      rightHeader={rightHeader}
      isSearchable={isSearchable}
      searchAttributes={['email', 'fullName']}
      extraFilters={createFilters(hiddenIds)}
      searchPlaceholder="Filter…"
      onRowClick={onRowClick}
      getDetailsHref={null}
    />
  );
}

function columnDefinitions(roles) {
  return [
    {
      id: 'gravatar',
      sortable: false,
      getContent(user) {
        return <Gravatar email={user.email} className={locals.avatar} />;
      },
      headCellProps: {
        className: locals.narrowColumn
      }
    },
    {
      id: 'fullName',
      label: 'Name',
      width: 70,
      ellipsis: true,
      getContent(user) {
        return (
          <WithSubscript subscript={user.email}>
            <span className={locals.ellipsis}>{user.fullName}</span>
          </WithSubscript>
        );
      },
      getValue(user) {
        return user.email;
      }
    },
    {
      id: 'role',
      label: 'Role',
      width: 30,
      getContent(user) {
        const role = roles.find(role => role.id === user.roleId);
        return role ? (
          <WithSubscript subscript={isRbacEnabled && role.restrictedAccess ? 'Limited Access' : ''}>
            <span>{role.name}</span>
          </WithSubscript>
        ) : null;
      }
    }
  ];
}

const defaultTableActions = {};

function defaultGetHeader(inSelectListDialog, tableActions) {
  return leftHeaderWithSelectAll('Users', inSelectListDialog, tableActions);
}

function getEntityName(entity) {
  return `User "${entity.fullName}"`;
}

export function noRightHeader() {
  // Used to explicitly disable that default right header when this is used in a
  // dialog to select users in the access scope form. Reason: The create-new button would navigate away from
  // the edit form in which's context the dialog is shown, thus the user would lose all their unsaved edits.
  return null;
}

function createFilters(hiddenIds) {
  const filters = [];
  if (hiddenIds) {
    filters.push(entity => hiddenIds.indexOf(entity.id) < 0);
  }
  return filters;
}
