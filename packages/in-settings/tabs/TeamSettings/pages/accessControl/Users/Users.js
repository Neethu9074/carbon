import React from 'react';

import InviteUserButton from 'in-settings/tabs/TeamSettings/pages/accessControl/Invites/InviteUserButton';
import { getEntityIdView, teamSettingsAccessControlUsers } from 'in-settings/navigation/paths';
import { getUsersAsResultObservable, removeUserFromTenant } from 'in-api/users';
import Delete from 'in-settings/components/ApiList/sharedComponents/Delete';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import { isLoading, hasError } from 'in-services/util/result';
import createApiList from 'in-settings/components/ApiList';
import Skeleton from 'in-new-components/Loading/Skeleton';
import { getRolesAsResultObservable } from 'in-api/roles';
import KeyValue from 'in-new-components/lists/KeyValue';
import Gravatar from 'in-components/Gravatar';
import connectTo from 'in-hoc/connectTo';

import locals from './Users.mless';

const UsersList = createApiList({
  ListRenderer,
  getItems: getUsersAsResultObservable,
  deleteItem: removeUserFromTenant,
  itemName: 'user',
  searchFields: ['fullName', 'email'],
  orderBy: 'fullName',
  renderAdditionalHeaderContent,
  boundedPath: '/users'
});

export default connectTo({ rolesResult: getRolesAsResultObservable() }, function Users({ rolesResult }) {
  return <UsersList rolesResult={rolesResult} />;
});

const columnDefinitions = [
  {
    width: '3rem',
    getContent({ user }) {
      return <Gravatar email={user.email} />;
    }
  },
  {
    getContent({ user }) {
      return <KeyValue value={user.fullName} label={user.email} inverted accentuated />;
    }
  },
  {
    width: '20rem',
    getContent({ user, rolesResult }) {
      if (isLoading(rolesResult)) {
        return <Skeleton className={locals.skeleton} />;
      }
      if (hasError(rolesResult)) {
        return null;
      }
      const userRole = rolesResult.data.filter(role => role.id !== user.roleId)[0];
      if (!userRole) {
        return null;
      }
      return <KeyValue value={userRole.name} label="Role" accentuated />;
    }
  },
  {
    width: '2rem',
    getContent({ user, deleteItem, currentDeletingItemIds }) {
      return (
        <Delete
          itemName={user.fullName}
          doDelete={() => deleteItem(user.id)}
          isDeleting={currentDeletingItemIds.has(user.id)}
        />
      );
    }
  }
];

function ListRenderer({ items, rolesResult, deleteItem, currentDeletingItemIds }) {
  return (
    <Ul>
      {items.map(user => (
        <Li key={user.id} href$={getEntityIdView(teamSettingsAccessControlUsers, user.id)}>
          <ColumnizedContent
            columnDefinitions={columnDefinitions}
            user={user}
            deleteItem={deleteItem}
            rolesResult={rolesResult}
            currentDeletingItemIds={currentDeletingItemIds}
          />
        </Li>
      ))}
    </Ul>
  );
}

function renderAdditionalHeaderContent({ setMessage }) {
  return <InviteUserButton setMessage={setMessage} />;
}
