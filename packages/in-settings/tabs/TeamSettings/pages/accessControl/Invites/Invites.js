/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import InviteUserButton from 'in-settings/tabs/TeamSettings/pages/accessControl/Invites/InviteUserButton';
import Delete from 'in-settings/components/ApiList/sharedComponents/Delete';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import { getInvitations$, revokeInvitation } from 'in-api/users';
import ApiList from 'in-settings/components/ApiList';
import Title from 'in-components/Title/Title';
import Gravatar from 'in-components/Gravatar';
import { config } from 'in-services/config';
import { t, Trans } from 'in-i18n';

export default function Invites() {
  return (
    <>
      <Title title={t('in-settings:tabs.pendingInvitations')} />
      <ApiList
        ListRenderer={ListRenderer}
        getItems={getInvitations$}
        deleteItem={revokeInvitation}
        itemName={t('in-settings:tabs.pendingInvitation')}
        searchFields={['email']}
        renderAdditionalHeaderContent={renderAdditionalHeaderContent}
        searchPlaceholder={t('in-settings:tabs.filterInvites')}
        boundedPath="/invites"
      />
    </>
  );
}

const columnDefinitions = [
  {
    width: '3rem',
    getContent({ invite }) {
      return <Gravatar email={invite.email} />;
    }
  },
  {
    getContent({ invite }) {
      return invite.email;
    }
  },
  {
    width: '2rem',
    getContent({ invite, deleteItem, currentDeletingItemIds }) {
      return (
        <Delete
          itemName={invite.email}
          doDelete={() => deleteItem(invite.email)}
          isDeleting={currentDeletingItemIds.has(invite.email)}
          confirmLabel={t('in-settings:tabs.revoke')}
          dialogMessage={() => (
            <span>
              <Trans
                i18nKey="in-settings:tabs.areYouSureYouWantToRevokeTheInvitationToJoinTheTenant"
                values={{
                  tenant: config.tenant,
                  email: invite.email
                }}
              />
            </span>
          )}
        />
      );
    }
  }
];

function ListRenderer({ items, deleteItem, currentDeletingItemIds }) {
  return (
    <Ul>
      {items.map(invite => (
        <Li key={invite.id}>
          <ColumnizedContent
            columnDefinitions={columnDefinitions}
            invite={invite}
            deleteItem={deleteItem}
            currentDeletingItemIds={currentDeletingItemIds}
          />
        </Li>
      ))}
    </Ul>
  );
}

function renderAdditionalHeaderContent({ setMessage, reload }) {
  return <InviteUserButton setMessage={setMessage} reload={reload} />;
}
