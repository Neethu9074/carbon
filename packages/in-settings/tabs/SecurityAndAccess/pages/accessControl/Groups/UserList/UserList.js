/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ColumnizedContent, KeyValue, Li, Typography, Ul } from '@instana/components';

import { getUsersAsResultObservable, removeUserFromTenant } from 'in-api/users';
import Delete from 'in-settings/components/ApiList/sharedComponents/Delete';
import UserIcon from 'in-components/UserIcon/UserIcon';
import ApiList from 'in-settings/components/ApiList';
import { t } from 'in-i18n';

export default function Users(props) {
  return (
    <ApiList
      {...props}
      getItems={getUsersAsResultObservable}
      deleteItem={removeUserFromTenant}
      itemName="User"
      searchFields={['fullName', 'email']}
      orderBy="fullName"
      boundedPath="/users"
      ListRenderer={DefaultListRenderer}
    />
  );
}

export const iconColumn = {
  width: '3rem',
  getContent() {
    return <UserIcon size="l" />;
  }
};

export const labelColumn = {
  getContent({ user, email }) {
    return (
      <KeyValue value={user?.fullName || t('in-settings:tabs.userDoesNotExist')} label={email} inverted accentuated />
    );
  }
};

export const idpGroupColumn = {
  width: '8rem',
  getContent({ joinedViaIdpMapping }) {
    return (
      joinedViaIdpMapping && (
        <KeyValue value={t('in-settings:tabs.idp')} label={t('in-settings:tabs.assignedBy')} accentuated />
      )
    );
  }
};

export const groupCount = {
  width: '8rem',
  getContent({ groups }) {
    if (groups === undefined) {
      return <></>;
    }
    return <KeyValue value={groups} label={t('in-settings:tabs.groups')} accentuated />;
  }
};

export const tfaStatus = {
  width: '8rem',
  getContent({ tfaStatus }) {
    if (tfaStatus === true) {
      return <Typography variant="body-small">{t('in-settings:tabs.tfaEnabled')}</Typography>;
    }
    return <></>;
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

const defaultColumnDefinitions = [iconColumn, labelColumn, groupCount, tfaStatus, deleteColumn];

function DefaultListRenderer({
  items,
  members,
  deleteItem,
  currentDeletingItemIds,
  columnDefinitions = defaultColumnDefinitions,
  getUserLink,
  onUserClick,
  page,
  setPage,
  itemsResult
}) {
  /**
   * called to remove a user
   * in order to fix the pagination the page number needs to be decreased - after removing the last user of a page
   */
  const remove = id => {
    if (items.length === 1 && itemsResult.length !== 1) {
      setPage(page - 1);
    }
    deleteItem(id);
  };
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
              joinedViaIdpMapping={members?.find(m => m.userId === user.id).joinedViaIdpMapping}
              groups={user.groupCount}
              deleteItem={remove}
              currentDeletingItemIds={currentDeletingItemIds}
              tfaStatus={user.tfaEnabled}
            />
          </Li>
        );
      })}
    </Ul>
  );
}
