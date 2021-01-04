import { createLogger } from '@instana/logger';
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
          <InviteUserDialog
            onSubmit={invitations =>
              onDoInviteUser(
                setMessage,
                invitations.map(i => i.email),
                invitations.map(i => i.groupId),
                reload
              )
            }
          />
        );
      }}
      icon="lib_openclose_add_circle_outline"
    >
      Invite User
    </Button>
  );
}

function onDoInviteUser(setMessage, emails, groupId, reload) {
  close();
  setMessage({ text: 'Sending invitation…', type: success });
  const invitationResult$ = sendInvitation(emails, groupId);
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
    setMessage({ text: `Failed to send invitation: ${error.message}`, type: errorType });
    logger.error(error);
  });
}
