/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import InviteUserDialog, {
  UserInvite
} from 'in-settings/tabs/TeamSettings/pages/accessControl/Invites/InviteUserDialog';
import { ApiGroup, PermissionSet } from 'in-types';
import { t } from 'in-i18n';

const emptyPermissions: PermissionSet = {
  applicationIds: [],
  infraDfqFilter: {},
  kubernetesClusterUUIDs: [],
  kubernetesNamespaceUIDs: [],
  mobileAppIds: [],
  permissions: [],
  websiteIds: [],
  syntheticTestIds: []
};

const getStrippedGroups: { data: ApiGroup[] } = {
  data: [
    {
      id: '-3',
      members: [],
      name: 'default',
      permissionSet: emptyPermissions
    },
    {
      id: 'groupId0',
      members: [],
      name: 'mw',
      permissionSet: emptyPermissions
    },
    {
      id: 'groupId1',
      members: [],
      name: 'hhm',
      permissionSet: emptyPermissions
    }
  ]
};

jest.mock('@instana/hooks', () => ({
  useObservable: () => getStrippedGroups
}));

describe('in-settings/tabs/TeamSettings/pages/accessControl/Invites/InviteUserDialog', () => {
  it('happy day', async () => {
    let val = {};
    render(
      <InviteUserDialog
        onSubmit={v => {
          val = v;
        }}
      />
    );
    expect(screen.getByText(t('in-settings:tabs.emailAddress'))).toBeInTheDocument();
    expect(screen.getByText(t('in-settings:tabs.group'))).toBeInTheDocument();
    expect(screen.getByTestId('delete_invite_0')).toBeVisible();
    expect(screen.queryByText(t('in-settings:tabs.someEmailsHaveFailedToSend'))).not.toBeInTheDocument();
    const emailInput = screen.getByLabelText(t('in-settings:tabs.emailAddress'));
    fireEvent.change(emailInput, { target: { value: 'jimmy.mcgill@example.com' } });
    const emailInputbutton = screen.getByText(t('in-settings:tabs.sendInvitation'));
    fireEvent.click(emailInputbutton);
    expect(val).toStrictEqual([{ groupId: '-3', email: 'jimmy.mcgill@example.com', userSentState: 'notSentYet' }]);
  });

  it('renders one email that worked and two that did not', async () => {
    const previousResult: UserInvite[] = [
      {
        groupId: 'groupId1',
        email: 'jimmy.mcgill@example.com',
        userSentState: 'sentSuccess'
      },
      {
        groupId: 'groupId0',
        email: 'kim.wexler@example.com',
        userSentState: 'sentFailureServerError'
      },
      {
        groupId: 'groupId0',
        email: 'nacho@example.com',
        userSentState: 'sentFailureUserExists'
      }
    ];
    render(<InviteUserDialog onSubmit={() => {}} previousResult={previousResult} />);

    expect(screen.getByText(t('in-settings:tabs.someEmailsHaveFailedToSend'))).toBeInTheDocument();

    expect(screen.getByTestId('invitation-email_0')).toHaveValue('jimmy.mcgill@example.com');
    expect(screen.getByTestId('invitation-email_0')).toBeDisabled();
    expect(screen.getByTestId('invitation-group_0')).toHaveValue('groupId1');
    expect(screen.getByTestId('invitation-group_0')).toBeDisabled();
    expect(screen.getByTestId('already_sent_0')).toBeInTheDocument();

    expect(screen.getByTestId('invitation-email_1')).toHaveValue('kim.wexler@example.com');
    expect(screen.getByTestId('invitation-group_1')).toHaveValue('groupId0');
    expect(screen.getByTestId('delete_invite_1')).toBeInTheDocument();

    expect(screen.getByTestId('invitation-email_2')).toHaveValue('nacho@example.com');
    expect(screen.getByTestId('invitation-email_2')).toBeDisabled();
    expect(screen.getByTestId('invitation-group_2')).toHaveValue('groupId0');
    expect(screen.getByTestId('invitation-group_2')).toBeDisabled();
    expect(screen.getByTestId('already_exists_2')).toBeInTheDocument();
  });

  it('the ones with error become not sent on retry', async () => {
    const previousResult: UserInvite[] = [
      {
        groupId: 'groupId1',
        email: 'jimmy.mcgill@example.com',
        userSentState: 'sentSuccess'
      },
      {
        groupId: 'groupId0',
        email: 'kim.wexler@example.com',
        userSentState: 'sentFailureServerError'
      },
      {
        groupId: 'groupId0',
        email: 'nacho@example.com',
        userSentState: 'sentFailureUserExists'
      }
    ];
    let val = {};
    render(
      <InviteUserDialog
        onSubmit={v => {
          val = v;
        }}
        previousResult={previousResult}
      />
    );
    const emailInputbutton = screen.getByText(t('in-settings:tabs.sendInvitation'));
    fireEvent.click(emailInputbutton);
    expect(val).toStrictEqual([
      { groupId: 'groupId1', email: 'jimmy.mcgill@example.com', userSentState: 'sentSuccess' },
      { groupId: 'groupId0', email: 'kim.wexler@example.com', userSentState: 'notSentYet' },
      { groupId: 'groupId0', email: 'nacho@example.com', userSentState: 'sentFailureUserExists' }
    ]);
  });

  it('button is disabled if no good email is added', async () => {
    const previousResult: UserInvite[] = [
      {
        groupId: 'groupId1',
        email: 'jimmy.mcgill@example.com',
        userSentState: 'sentSuccess'
      },
      {
        groupId: 'groupId0',
        email: 'nacho@example.com',
        userSentState: 'sentFailureUserExists'
      }
    ];
    let val = 'not called';
    render(
      <InviteUserDialog
        onSubmit={v => {
          val = 'called' + JSON.stringify(v);
        }}
        previousResult={previousResult}
      />
    );
    const emailInputbutton = screen.getByText(t('in-settings:tabs.sendInvitation'));
    fireEvent.click(emailInputbutton);
    expect(val).toBe('not called');
  });
});
