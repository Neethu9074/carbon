/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ColumnizedContent, Ul, Li } from '@instana/components';
import { KeyValue } from '@instana/components';

import { getUsersAsResultObservable, removeUserFromTenant } from 'in-api/users';
import Delete from 'in-settings/components/ApiList/sharedComponents/Delete';
import ApiList from 'in-settings/components/ApiList';
import Gravatar from 'in-components/Gravatar';
import { t } from 'in-i18n';

export default function Users(props) {
  return (
    <ApiList
      {...props}
      getItems={getUsersAsResultObservable}
      deleteItem={removeUserFromTenant}
      itemName={t('in-settings:teamSettings.accessControl.users.userItemName')}
      searchFields={['fullName', 'email']}
      orderBy="fullName"
      boundedPath="/users"
      ListRenderer={DefaultListRenderer}
    />
  );
}

export const iconColumn = {
  width: '3rem',
  getContent({ email }) {
    return <Gravatar email={email} />;
  }
};

export const labelColumn = {
  getContent({ user, email }) {
    return (
      <KeyValue value={user?.fullName || t('in-settings:tabs.userDoesNotExist')} label={email} inverted accentuated />
    );
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

const defaultColumnDefinitions = [iconColumn, labelColumn, deleteColumn];

function DefaultListRenderer({
  items,
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
              currentDeletingItemIds={currentDeletingItemIds}
            />
          </Li>
        );
      })}
    </Ul>
  );
}
