import { createLogger } from 'instalog';
import React from 'react';

import InviteUserDialog from 'in-settings/tabs/TeamSettings/pages/accessControl/Invites/InviteUserDialog';
import { success, error as errorType } from 'in-new-components/Message/types';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { track, USER_INVITE } from 'in-services/tracking/tracking';
import { sendInvitation } from 'in-api/users';
import Button from 'in-new-components/Button';

const logger = createLogger('InviteUserButton');

export default function InviteUserButton({ setMessage, reload }) {
  return (
    <Button
      kind="action"
      onClick={() => {
        track(USER_INVITE);
        addActiveDialog(
          <InviteUserDialog onSubmit={(email, roleId) => onDoInviteUser(setMessage, email, roleId, reload)} />
        );
      }}
      icon="lib_openclose_add_circle_outline"
    >
      Invite User
    </Button>
  );
}

function onDoInviteUser(setMessage, email, roleId, reload) {
  close();
  setMessage({ text: 'Sending invitation…', type: success });
  const invitationResult$ = sendInvitation(email, roleId);
  invitationResult$.once(() => {
    setMessage({ text: 'Invitation successfully sent.', type: success });
    if (reload) {
      reload();
    }
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  });
  invitationResult$.errors().once(error => {
    setMessage({ text: `Failed to send invitation for ${email}: ${error.message}`, type: errorType });
    logger.error(error);
  });
}
