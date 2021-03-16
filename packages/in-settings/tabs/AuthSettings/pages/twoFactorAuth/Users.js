/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TwoFactorMarker from 'in-settings/tabs/AuthSettings/pages/twoFactorAuth/TwoFactorMarker';
import { getEntityIdView, teamSettingsAccessControlUsers } from 'in-settings/navigation/paths';
import { getUsersAsResultObservable } from 'in-settings/tabs/AuthSettings/api/twoFactorAuth';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import { compare } from 'in-services/formatters/boolean';
import KeyValue from 'in-new-components/lists/KeyValue';
import ApiList from 'in-settings/components/ApiList';
import Gravatar from 'in-components/Gravatar';

export default function Users(props) {
  return (
    <ApiList
      {...props}
      getItems={getUsersAsResultObservable}
      itemName="User"
      searchFields={['fullName', 'email']}
      orderBy={(user1, user2) => compare(user1.twoFaEnabled, user2.twoFaEnabled)}
      boundedPath="/users"
      ListRenderer={DefaultListRenderer}
    />
  );
}

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
    width: '10rem',
    getContent({ user }) {
      return user.twoFaEnabled ? <TwoFactorMarker /> : null;
    }
  }
];

function DefaultListRenderer({ items, rolesResult, deleteItem, currentDeletingItemIds }) {
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
