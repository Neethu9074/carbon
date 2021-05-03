/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KeyValue } from '@instana/components';

import { removeUserFromGroup, getStrippedGroupsAsResultObservable } from 'in-settings/tabs/TeamSettings/api/groups';
import AddUserToGroupButton from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/AddUserToGroupButton';
import { getEntityIdView, teamSettingsAccessControlGroups } from 'in-settings/navigation/paths';
import { ListInsideACardRenderer } from 'in-settings/components/ApiList/renderer/renderer';
import Delete from 'in-settings/components/ApiList/sharedComponents/Delete';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import ApiList from 'in-settings/components/ApiList';
import { t, Trans } from 'in-i18n';

export default function Groups({ userId, refresh }) {
  return (
    <ApiList
      ListRenderer={ListRenderer}
      getItems={getStrippedGroupsAsResultObservable}
      itemName={t('in-settings:teamSettings.accessControl.users.capitalGroupItemName')}
      orderBy="name"
      renderer={ListInsideACardRenderer}
      pageSize={5}
      renderAdditionalHeaderContent={renderAdditionalHeaderContent}
      userId={userId}
      refresh={refresh}
      filterFunction={({ members }) => {
        for (let i = 0; i < members.length; i++) {
          if (userId === members[i].userId) {
            return true;
          }
        }
        return false;
      }}
    />
  );
}

const columnDefinitions = [
  {
    getContent({ group }) {
      return group.name;
    }
  },
  {
    width: '8rem',
    getContent({ group }) {
      return <KeyValue value={group.members.length} label={t('in-settings:tabs.users')} accentuated />;
    }
  },
  {
    width: '2rem',
    getContent({ group, deleteItem, currentDeletingItemIds }) {
      return (
        <Delete
          itemName={group.name}
          doDelete={deleteItem}
          isDeleting={currentDeletingItemIds.has(group.id)}
          dialogMessage={() => {
            return (
              <span>
                <Trans
                  i18nKey="in-settings:tabs.areYouSureYouWantToDeleteThisUserFromTheGroup"
                  values={{ groupName: group.name }}
                />
              </span>
            );
          }}
        />
      );
    }
  }
];

function ListRenderer({ items, userId, refresh, setErrorMessage, currentDeletingItemIds }) {
  return (
    <Ul>
      {items.map(group => (
        <Li key={group.id} href$={getEntityIdView(teamSettingsAccessControlGroups, group.id)}>
          <ColumnizedContent
            columnDefinitions={columnDefinitions}
            group={group}
            deleteItem={() => removeUserFromGroupInternal(userId, group.id, refresh, setErrorMessage)}
            currentDeletingItemIds={currentDeletingItemIds}
          />
        </Li>
      ))}
    </Ul>
  );
}

function removeUserFromGroupInternal(userId, groupId, refresh, setErrorMessage) {
  const result$ = removeUserFromGroup(groupId, userId);
  result$.once(
    () => {
      refresh();
    },
    error => {
      setErrorMessage(t('in-settings:tabs.failedToRemoveUserFromGroup', { err: error.message }));
    }
  );
}

function renderAdditionalHeaderContent({ userId, refresh, setErrorMessage }) {
  return <AddUserToGroupButton userId={userId} refresh={refresh} setErrorMessage={setErrorMessage} />;
}
