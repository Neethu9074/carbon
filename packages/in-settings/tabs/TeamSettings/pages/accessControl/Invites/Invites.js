/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import InviteUserButton from 'in-settings/tabs/TeamSettings/pages/accessControl/Invites/InviteUserButton';
import Delete from 'in-settings/components/ApiList/sharedComponents/Delete';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import { getInvitations$, revokeInvitation } from 'in-api/users';
import ApiList from 'in-settings/components/ApiList';
import Title from 'in-components/Title/Title';
import Gravatar from 'in-components/Gravatar';
import { config } from 'in-services/config';

export default function Invites() {
  return (
    <>
      <Title title="Pending Invitations" />
      <ApiList
        ListRenderer={ListRenderer}
        getItems={getInvitations$}
        deleteItem={revokeInvitation}
        itemName={t('in-settings:teamSettings.accessControl.invites.itemName')}
        searchFields={['email']}
        renderAdditionalHeaderContent={renderAdditionalHeaderContent}
        searchPlaceholder={t('in-settings:teamSettings.accessControl.invites.searchPlaceHolder')}
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
          confirmLabel="Revoke"
          dialogMessage={() => (
            <span>
              Are you sure you want to revoke the invitation to join the <strong>{config.tenant}</strong> tenant for{' '}
              <strong>{invite.email}</strong>?
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
