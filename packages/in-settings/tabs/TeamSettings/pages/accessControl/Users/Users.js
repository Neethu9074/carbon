import React from 'react';

import InviteUserButton from 'in-settings/tabs/TeamSettings/pages/accessControl/Invites/InviteUserButton';
import { getEntityIdView, teamSettingsAccessControlUsers } from 'in-settings/navigation/paths';
import UserList from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/UserList';

export default function Users() {
  return (
    <UserList
      renderAdditionalHeaderContent={renderAdditionalHeaderContent}
      getUserLink={user => getEntityIdView(teamSettingsAccessControlUsers, user.id)}
    />
  );
}

function renderAdditionalHeaderContent({ setMessage }) {
  return <InviteUserButton setMessage={setMessage} />;
}
