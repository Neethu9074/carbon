/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import InviteUserButton from 'in-settings/tabs/TeamSettings/pages/accessControl/Invites/InviteUserButton';
import { getEntityIdView, teamSettingsAccessControlUsers } from 'in-settings/navigation/paths';
import UserList from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/UserList';
import Title from 'in-components/Title/Title';

export default function Users() {
  return (
    <>
      <Title title="Users" />
      <UserList
        renderAdditionalHeaderContent={renderAdditionalHeaderContent}
        getUserLink={user => getEntityIdView(teamSettingsAccessControlUsers, user.id)}
      />
    </>
  );
}

function renderAdditionalHeaderContent({ setMessage }) {
  return <InviteUserButton setMessage={setMessage} />;
}
