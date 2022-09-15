/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ColumnizedContent, Ul, Li } from '@instana/components';
import { KeyValue } from '@instana/components';

import {
  removeUserFromGroup,
  getStrippedGroupsWithIdpFlagAsResultObservable
} from 'in-settings/tabs/TeamSettings/api/groups';
import AddUserToGroupButton from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/AddUserToGroupButton';
import { getEntityIdView, teamSettingsAccessControlGroups } from 'in-settings/navigation/paths';
import { ListInsideACardRenderer } from 'in-settings/components/ApiList/renderer/renderer';
import Delete from 'in-settings/components/ApiList/sharedComponents/Delete';
import WithSubscript from 'in-settings/components/WithSubscript';
import ApiList from 'in-settings/components/ApiList';
import { t, Trans } from 'in-i18n';

export default function Groups({ userId, refresh }) {
  return (
    <ApiList
      ListRenderer={ListRenderer}
      getItems={getStrippedGroupsWithIdpFlagAsResultObservable(userId)}
      itemName="Group"
      orderBy="name"
      renderer={ListInsideACardRenderer}
      pageSize={5}
      renderAdditionalHeaderContent={renderAdditionalHeaderContent}
      userId={userId}
      refresh={refresh}
    />
  );
}

const columnDefinitions = [
  {
    getContent({ group }) {
      return (
        <WithSubscript subscript={group.limited ? t('in-settings:tabs.limitedAccess') : null}>
          {group.groupName}
        </WithSubscript>
      );
    }
  },
  {
    width: '8rem',
    getContent({ group }) {
      return (
        group.joinedViaIdpMapping && (
          <KeyValue value={t('in-settings:tabs.idp')} label={t('in-settings:tabs.assignedBy')} accentuated />
        )
      );
    }
  },
  {
    width: '8rem',
    getContent({ group }) {
      return <KeyValue value={group.groupSize} label={t('in-settings:tabs.users')} accentuated />;
    }
  },
  {
    width: '2rem',
    getContent({ group, deleteItem, currentDeletingItemIds }) {
      return (
        <Delete
          itemName={group.groupName}
          doDelete={deleteItem}
          isDeleting={currentDeletingItemIds.has(group.groupId)}
          dialogMessage={() => {
            return (
              <span>
                <Trans
                  i18nKey="in-settings:tabs.areYouSureYouWantToDeleteThisUserFromTheGroup"
                  values={{ groupName: group.groupName }}
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
        <Li key={group.groupId} href$={getEntityIdView(teamSettingsAccessControlGroups, group.groupId)}>
          <ColumnizedContent
            columnDefinitions={columnDefinitions}
            group={group}
            deleteItem={() => removeUserFromGroupInternal(userId, group.groupId, refresh, setErrorMessage)}
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
