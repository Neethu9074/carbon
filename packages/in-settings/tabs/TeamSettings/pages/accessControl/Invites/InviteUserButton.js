/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { createLogger } from '@instana/logger';
import { Button } from '@instana/components';

import InviteUserDialog from 'in-settings/tabs/TeamSettings/pages/accessControl/Invites/InviteUserDialog';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { track, USER_INVITE } from 'in-services/tracking/tracking';
import { sendInvitation } from 'in-api/users';
import { t } from 'in-i18n';

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
      {t('in-settings:tabs.inviteUser')}
    </Button>
  );
}

function onDoInviteUser(setMessage, emails, groupId, reload) {
  close();
  setMessage({ text: t('in-settings:tabs.sendingInvitation'), type: 'success' });
  const invitationResult$ = sendInvitation(emails, groupId);
  invitationResult$.once(() => {
    setMessage({
      text: t('in-settings:tabs.invitationSuccessfullySent'),
      type: 'success'
    });
    if (reload) {
      reload();
    }
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  });
  invitationResult$.errors().once(error => {
    setMessage({
      text: t('in-settings:tabs.failedToSendInvitation', { err: error.message }),
      type: 'error'
    });
    logger.error(error);
  });
}
