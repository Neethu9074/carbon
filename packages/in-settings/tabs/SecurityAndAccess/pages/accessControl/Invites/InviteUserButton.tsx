/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { createLogger } from '@instana/logger';
import { Button } from '@instana/components';

import InviteUserDialog, {
  InviteSentState,
  UserSentStateStatus
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/ShareAndInviteDialogBox/ShareAndInviteDialogBox';
import { UserInvite } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/ShareAndInviteDialogBox/ShareAndInviteDialogBox_interfaces';
import { createInviteForm } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/InviteForm';
import { securityAndAccessAccessControlInvites } from 'in-settings/navigation/paths';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { track, USER_INVITE } from 'in-services/tracking/tracking';
import { InvitationResult, sendInvitations } from 'in-api/users';
import { emptyObject } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

const logger = createLogger('InviteUserButton');

interface UserInvitationResult {
  // Replace with generated type
  userEmail: string;
  invitationStatus: UserSentStateStatus;
}

export default function InviteUserButton() {
  const { trackCta } = useSegmentTracking();

  return (
    <Button
      kind="action"
      onClick={() => {
        // Mixpanel tracking
        track(USER_INVITE, emptyObject);
        // Segment tracking
        trackCta(USER_INVITE, emptyObject);
        addActiveDialog(<InviteUserDialog />);
      }}
      icon="lib_openclose_add_circle_outline"
    >
      {t('in-settings:tabs.inviteUser')}
    </Button>
  );
}

export function onDoInviteUser(
  setMessage: any,
  invitations: UserInvite[],
  setForm: any,
  setInvitationResult: React.Dispatch<React.SetStateAction<UserInvite[]>>,
  goToPath?: (path: string) => void
) {
  setMessage({
    id: `${Math.random()}`,
    text: t('in-settings:tabs.sendingInvitation'),
    type: 'success'
  });

  const invitationResult$ = sendInvitations(
    invitations
      .filter(i => i.userSentState === InviteSentState.notSentYet)
      .map(({ email, groupId, message, path, pageName }) => ({ email, groupId, message, path, pageName }))
  );
  invitationResult$.once((data: any) => {
    const failed = data.body.invitationResults.filter(
      (userInvitationResult: UserInvitationResult): boolean => userInvitationResult.invitationStatus !== 'SUCCESS'
    );
    if (failed?.length > 0) {
      const previousResult: UserInvite[] = failed.map((userInvitationResult: UserInvitationResult): UserInvite => {
        const invitation = invitations.find(i => i.email === userInvitationResult.userEmail);
        return {
          groupId: invitation?.groupId as string,
          email: userInvitationResult.userEmail,
          message: invitation?.message,
          path: invitation?.path,
          pageName: invitation?.pageName,
          userSentState: InviteSentState[userInvitationResult.invitationStatus]
        };
      });

      setInvitationResult(previousResult);
      setForm(createInviteForm(previousResult, true).setTouched(true));
      setMessage({
        text: t('in-settings:tabs.failedToSendInvitation', {
          err: failed.map(({ userEmail }: InvitationResult) => userEmail).join(', ')
        }),
        type: 'error'
      });
    } else {
      setMessage({
        id: `${Math.random()}`,
        text: t('in-settings:tabs.invitationSuccessfullySent'),
        type: 'success'
      });
      close();
      if (goToPath) {
        goToPath(securityAndAccessAccessControlInvites);
      }
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
