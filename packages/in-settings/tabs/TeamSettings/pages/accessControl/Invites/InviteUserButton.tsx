/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Observable } from '@instana/observables';
import { createLogger } from '@instana/logger';
import { Button } from '@instana/components';

import InviteUserDialog, {
  UserInvite,
  UserSentState
} from 'in-settings/tabs/TeamSettings/pages/accessControl/Invites/InviteUserDialog';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { track, USER_INVITE } from 'in-services/tracking/tracking';
import { emptyObject } from 'in-services/fixedObjects';
import { sendInvitation } from 'in-api/users';
import { Response } from 'in-services/http';
import { t } from 'in-i18n';

const logger = createLogger('InviteUserButton');

type InvitationStatus = 'SUCCESS' | 'INTERNAL_ERROR' | 'FAILURE_USER_ALREADY_EXISTS';

interface UserInvitationResult {
  // Replace with generated type
  userEmail: string;
  invitationStatus: InvitationStatus;
}

interface UserInvitationResults {
  // Replace with generated type
  invitationResults: UserInvitationResult[];
}

export default function InviteUserButton({ setMessage, reload }: { setMessage: any; reload: any }) {
  return (
    <Button
      kind="action"
      onClick={() => {
        track(USER_INVITE, emptyObject);
        addActiveDialog(
          <InviteUserDialog onSubmit={(invitations: UserInvite[]) => onDoInviteUser(setMessage, invitations, reload)} />
        );
      }}
      icon="lib_openclose_add_circle_outline"
    >
      {t('in-settings:tabs.inviteUser')}
    </Button>
  );
}

function mapToUserSentState(invitationStatus: InvitationStatus): UserSentState {
  switch (invitationStatus) {
    case 'SUCCESS':
      return 'sentSuccess';
    case 'INTERNAL_ERROR':
      return 'sentFailureServerError';
    case 'FAILURE_USER_ALREADY_EXISTS':
      return 'sentFailureUserExists';
  }
}

export function onDoInviteUser(setMessage: any, invitations: UserInvite[], reload: any) {
  close();
  setMessage({
    id: `${Math.random()}`,
    text: t('in-settings:tabs.sendingInvitation'),
    type: 'success'
  });
  // @ts-expect-error
  const invitationResult$: Observable<Response<UserInvitationResult>> = sendInvitation(
    invitations.filter(i => i.userSentState === 'notSentYet')
  );
  invitationResult$.once((data: any) => {
    const someFailed = data.body.invitationResults.some(
      (userInvitationResult: UserInvitationResult): boolean => userInvitationResult.invitationStatus !== 'SUCCESS'
    );

    if (someFailed) {
      const result: UserInvitationResults = data.body;
      const previousResult: UserInvite[] = result.invitationResults.map(
        (userInvitationResult: UserInvitationResult): UserInvite => {
          const maybeGroupId = invitations.find(i => i.email === userInvitationResult.userEmail)?.groupId;
          return {
            groupId: maybeGroupId as string,
            email: userInvitationResult.userEmail,
            userSentState: mapToUserSentState(userInvitationResult.invitationStatus)
          };
        }
      );

      addActiveDialog(
        <InviteUserDialog
          previousResult={previousResult}
          onSubmit={(invitations: UserInvite[]) => onDoInviteUser(setMessage, invitations, reload)}
        />
      );
    } else {
      setMessage({
        id: `${Math.random()}`,
        text: t('in-settings:tabs.invitationSuccessfullySent'),
        type: 'success'
      });
      if (reload) {
        reload();
      }
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  });
  invitationResult$.errors().once((error: any) => {
    setMessage({
      text: t('in-settings:tabs.failedToSendInvitation', { err: error.message }),
      type: 'error'
    });
    logger.error(JSON.stringify(error));
  });
}
