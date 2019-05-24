import React from 'react';
import { createLogger } from 'instalog';

import InviteUserDialog from 'in-settings/tabs/TeamSettings/pages/accessControl/Invites/InviteUserDialog';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import { track, USER_INVITE } from 'in-services/tracking/tracking';
import { sendInvitation } from 'in-api/users';
import Button from 'in-new-components/Button';

import locals from './InviteUserButton.mless';

const logger = createLogger('InviteUserButton');

export default function InviteUserButton({ setMessage }) {
  return (
    <Button
      className={locals.createNewButton}
      kind="action"
      onClick={() => {
        track(USER_INVITE);
        setActiveDialog(<InviteUserDialog onSubmit={(email, roleId) => onDoInviteUser(setMessage, email, roleId)} />);
      }}
      icon="lib_openclose_add_circle_outline"
    >
      Invite User
    </Button>
  );
}

function onDoInviteUser(setMessage, email, roleId) {
  close();
  setMessage({ message: 'Sending invitation…', type: 'success' });
  const invitationResult$ = sendInvitation(email, roleId);
  invitationResult$.once(() => {
    setMessage({ message: 'Invitation successfully send.', type: 'success' });
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  });
  invitationResult$.errors().once(error => {
    setMessage({ message: `Failed to send invitation for ${email}: ${error.message}`, type: 'error' });
    logger.error(error);
  });
}
