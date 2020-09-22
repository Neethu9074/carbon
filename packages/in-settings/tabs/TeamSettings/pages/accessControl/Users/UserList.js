import React from 'react';

import { getUsersAsResultObservable, removeUserFromTenant } from 'in-api/users';
import Delete from 'in-settings/components/ApiList/sharedComponents/Delete';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import createApiList from 'in-settings/components/ApiList';
import { getRolesAsResultObservable } from 'in-api/roles';
import KeyValue from 'in-new-components/lists/KeyValue';
import Gravatar from 'in-components/Gravatar';
import connectTo from 'in-hoc/connectTo';

const UsersList = createApiList({
  getItems: getUsersAsResultObservable,
  deleteItem: removeUserFromTenant,
  itemName: 'User',
  searchFields: ['fullName', 'email'],
  orderBy: 'fullName',
  boundedPath: '/users'
});

export default connectTo({ rolesResult: getRolesAsResultObservable() }, function Users(props) {
  return <UsersList {...props} ListRenderer={DefaultListRenderer} />;
});

export const iconColumn = {
  width: '3rem',
  getContent({ email }) {
    return <Gravatar email={email} />;
  }
};

export const labelColumn = {
  getContent({ user, email }) {
    return <KeyValue value={user?.fullName || 'User does not exist'} label={email} inverted accentuated />;
  }
};

export const roleColumn = {
  width: '20rem',
  getContent({ user, rolesResult }) {
    if (!user) {
      return null;
    }
    const userRole = (rolesResult.data || []).filter(role => role.id === user.roleId)[0];
    if (!userRole) {
      return null;
    }
    return <KeyValue value={userRole.name} label="Role" accentuated />;
  }
};

export const deleteColumn = {
  width: '2rem',
  getContent({ user, deleteItem, currentDeletingItemIds }) {
    if (!user) {
      return null;
    }
    return (
      <Delete
        itemName={user.fullName}
        doDelete={() => deleteItem(user.id)}
        isDeleting={currentDeletingItemIds.has(user.id)}
      />
    );
  }
};

const defaultColumnDefinitions = [iconColumn, labelColumn, roleColumn, deleteColumn];

function DefaultListRenderer({
  items,
  rolesResult,
  deleteItem,
  currentDeletingItemIds,
  columnDefinitions = defaultColumnDefinitions,
  getUserLink,
  onUserClick
}) {
  return (
    <Ul>
      {items.map(user => {
        return (
          <Li
            key={user.id}
            href$={getUserLink && user && getUserLink(user)}
            onClick={onUserClick && user ? () => onUserClick(user) : undefined}
          >
            <ColumnizedContent
              columnDefinitions={columnDefinitions}
              userId={user.id}
              user={user}
              email={user.email}
              deleteItem={deleteItem}
              rolesResult={rolesResult}
              currentDeletingItemIds={currentDeletingItemIds}
            />
          </Li>
        );
      })}
    </Ul>
  );
}
