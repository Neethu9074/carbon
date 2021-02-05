/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { removeUserFromGroup, getStrippedGroupsAsResultObservable } from 'in-settings/tabs/TeamSettings/api/groups';
import AddUserToGroupButton from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/AddUserToGroupButton';
import { getEntityIdView, teamSettingsAccessControlGroups } from 'in-settings/navigation/paths';
import { ListInsideACardRenderer } from 'in-settings/components/ApiList/renderer/renderer';
import Delete from 'in-settings/components/ApiList/sharedComponents/Delete';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import createApiList from 'in-settings/components/ApiList';
import KeyValue from 'in-new-components/lists/KeyValue';

const GroupList = createApiList({
  ListRenderer,
  getItems: getStrippedGroupsAsResultObservable,
  itemName: 'Group',
  orderBy: 'name',
  renderer: ListInsideACardRenderer,
  pageSize: 5,
  renderAdditionalHeaderContent: renderAdditionalHeaderContent,
  boundedPath: '/unknown' // providing a bad parameter here avoids binding page as matrix parameter.
});

export default function Groups({ userId, refresh }) {
  return (
    <GroupList
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
      return <KeyValue value={group.members.length} label="Users" accentuated />;
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
                Are you sure you want to delete this user from the <strong>{group.name}</strong> group?
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
      setErrorMessage(`Failed to remove user from group: ${error.message}`);
    }
  );
}

function renderAdditionalHeaderContent({ userId, refresh, setErrorMessage }) {
  return <AddUserToGroupButton userId={userId} refresh={refresh} setErrorMessage={setErrorMessage} />;
}
