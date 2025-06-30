/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ColumnizedContent, KeyValue, Ul, Li, Message } from '@instana/components';

import {
  removeUserFromGroup,
  getStrippedGroupsWithIdpFlagAsResultObservable
} from 'in-settings/tabs/SecurityAndAccess/api/groups';
import AddUserToGroupButton from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Users/AddUserToGroupButton';
import { getEntityIdView, securityAndAccessAccessControlGroups } from 'in-settings/navigation/paths';
import { ListInsideACardRenderer } from 'in-settings/components/ApiList/renderer/renderer';
import Delete from 'in-settings/components/ApiList/sharedComponents/Delete';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import WithSubscript from 'in-components/WithSubscript/WithSubscript';
import ApiList from 'in-settings/components/ApiList';
import { ownerRoleId } from 'in-stores/user';
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
          dialogMessage={
            <Trans
              i18nKey="in-settings:tabs.areYouSureYouWantToDeleteThisUserFromTheGroup"
              values={{ groupName: group.groupName }}
            />
          }
        />
      );
    }
  }
];

/**
 * Determines the warning message
 *
 * @param {{data:object|null}|null}} itemsResult fetched result
 * @returns message or null
 */
const determineMessage = itemsResult => {
  let message = null;
  const items = itemsResult?.data ?? [];
  const filterOwnerGroup = ({ groupId }) => groupId === ownerRoleId;
  const filterNonLimitedAccessGroups = ({ limited }) => !limited;

  const hasLimitedAccessGroups = items.some(({ limited }) => limited);
  if (items.some(filterOwnerGroup) && hasLimitedAccessGroups) {
    message = t('in-settings:tabs.ownerGroupMemberNotLimitable');
  } else if (hasLimitedAccessGroups && items.some(filterNonLimitedAccessGroups)) {
    message = t('in-settings:tabs.mergedPermissionWithCombinationOfLimitedAndUnlimited');
  }
  return message;
};

function ListRenderer({ items, userId, refresh, setErrorMessage, currentDeletingItemIds, itemsResult, page, setPage }) {
  const message = determineMessage(itemsResult);
  const { createHrefToPath } = useNavigation();
  return (
    <>
      {message && <Message type="warning" title={message} />}
      <Ul>
        {items.map(group => (
          <Li
            key={group.groupId}
            href={getEntityIdView(securityAndAccessAccessControlGroups, group.groupId, createHrefToPath)}
          >
            <ColumnizedContent
              columnDefinitions={columnDefinitions}
              group={group}
              deleteItem={() =>
                removeUserFromGroupInternal(
                  userId,
                  group.groupId,
                  refresh,
                  setErrorMessage,
                  setPage,
                  page,
                  items.length
                )
              }
              currentDeletingItemIds={currentDeletingItemIds}
            />
          </Li>
        ))}
      </Ul>
    </>
  );
}

function removeUserFromGroupInternal(userId, groupId, refresh, setErrorMessage, setPage, page, itemSize) {
  const result$ = removeUserFromGroup(groupId, userId);
  result$.once(
    () => {
      if (itemSize - 1 === 0) {
        const previousPage = page - 1 === 0 ? 1 : page - 1;
        setPage(previousPage);
      }
      refresh();
    },
    error => {
      setErrorMessage(t('in-settings:tabs.failedToRemoveUserFromGroup', { err: error.message }));
    }
  );
}

function renderAdditionalHeaderContent({ userId, refresh }) {
  return <AddUserToGroupButton userId={userId} refresh={refresh} />;
}
