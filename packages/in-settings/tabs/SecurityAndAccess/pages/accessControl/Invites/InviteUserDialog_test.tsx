/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { onDoInviteUser } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/InviteUserButton';
import InviteUserDialog from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/InviteUserDialog';
import { close as u1 } from 'in-components/DialogPresenter/store';
import { ApiGroup, PermissionSet } from 'in-types';
import { sendInvitations } from 'in-api/users';
import { t } from 'in-i18n';

const emptyPermissions: PermissionSet = {
  applicationIds: [],
  infraDfqFilter: {},
  kubernetesClusterUUIDs: [],
  kubernetesNamespaceUIDs: [],
  mobileAppIds: [],
  permissions: [],
  websiteIds: [],
  businessPerspectiveIds: [],
  syntheticCredentialKeys: [],
  syntheticTestIds: [],
  actionFilter: {}
};
const close = u1 as jest.MockedFunction<typeof u1>;

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
const apiCallResult = {
  body: {
    invitationResults: [
      {
        userEmail: 'lannister@example.com',
        invitationStatus: 'SUCCESS'
      }
    ]
  }
};
const apiCallResultUserExists = {
  body: {
    invitationResults: [
      {
        userEmail: 'baratheon@example.com',
        invitationStatus: 'FAILURE_USER_ALREADY_EXISTS'
      }
    ]
  }
};

jest.mock('in-components/DialogPresenter/store', () => ({
  addActiveDialog: jest.fn(),
  close: jest.fn()
}));
jest.mock('@instana/hooks', () => ({
  useObservable: () => getStrippedGroups
}));
jest.mock('in-stores/navigation/hooks/useNavigation', () => ({
  useNavigation: jest.fn(() => ({ location: { pathname: '', matrix: {} }, navigate: jest.fn() }))
}));
jest.mock('in-api/users');

describe('in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/InviteUserDialog', () => {
  beforeEach(jest.clearAllMocks);

  it('happy day', async () => {
    const { container } = render(<InviteUserDialog />);
    const removeButton = container.querySelector('#delete_invite_0');
    expect(screen.getByText(t('in-settings:tabs.emailAddress'))).toBeInTheDocument();
    expect(screen.getByText(t('in-settings:tabs.group'))).toBeInTheDocument();
    expect(screen.queryByText(t('in-settings:tabs.someEmailsHaveFailedToSend'))).not.toBeInTheDocument();
    expect(removeButton).toBeVisible();
  });

  it('should disable button if email format is invalid', async () => {
    const { container } = render(<InviteUserDialog />);
    const emailInput = screen.getByTestId('invitation-email_0');
    fireEvent.change(emailInput, { target: { value: 'jimmy.mcgill' } });
    fireEvent.submit(container.querySelector('form') as HTMLFormElement);
    const sendInviteButton = screen.getByText(t('in-settings:tabs.sendInvitation'));
    expect(sendInviteButton).toBeDisabled();
  });

  it('invite users success', async () => {
    const setMessage = jest.fn();
    const setInvitationResult = jest.fn();
    const setForm = jest.fn();
    (sendInvitations as jest.Mock).mockReturnValue({
      once: (onSuccess: (data: any) => void) => onSuccess(apiCallResult),
      errors: () => ({ once: () => {} })
    });

    render(<InviteUserDialog />);

    const emailInput = screen.getByTestId('invitation-email_0');
    fireEvent.change(emailInput, { target: { value: 'jimmy.mcgill@example.com' } });
    const sendInviteButton = screen.getByText(t('in-settings:tabs.sendInvitation'));
    fireEvent.click(sendInviteButton);

    onDoInviteUser(
      setMessage,
      [
        {
          groupId: '-3',
          email: 'jimmy.mcgill@example.com',
          userSentState: 'notSentYet'
        }
      ],
      setForm,
      setInvitationResult
    );
    expect(setMessage.mock.calls[0][0]).toMatchObject({
      text: t('in-settings:tabs.sendingInvitation'),
      type: 'success'
    });
    expect(setMessage.mock.calls[1][0]).toMatchObject({
      text: t('in-settings:tabs.invitationSuccessfullySent'),
      type: 'success'
    });
    expect(close).toBeCalled();
  });

  it('should show error message if user already isExists', async () => {
    const setMessage = jest.fn();
    const setInvitationResult = jest.fn();
    const setForm = jest.fn();
    (sendInvitations as jest.Mock).mockReturnValue({
      once: (onSuccess: (data: any) => void) => onSuccess(apiCallResultUserExists),
      errors: () => ({ once: () => {} })
    });

    render(<InviteUserDialog />);

    const emailInputValue = 'baratheon@example.com';
    const emailInput = screen.getByTestId('invitation-email_0');
    fireEvent.change(emailInput, { target: { value: emailInputValue } });
    const sendInviteButton = screen.getByText(t('in-settings:tabs.sendInvitation'));
    fireEvent.click(sendInviteButton);

    onDoInviteUser(
      setMessage,
      [
        {
          groupId: '-3',
          email: 'baratheon@example.com',
          userSentState: 'notSentYet'
        }
      ],
      setForm,
      setInvitationResult
    );
    expect(setMessage.mock.calls[0][0]).toMatchObject({
      text: t('in-settings:tabs.sendingInvitation'),
      type: 'success'
    });
    expect(setMessage.mock.calls[1][0]).toMatchObject({
      text: t('in-settings:tabs.failedToSendInvitation') + emailInputValue,
      type: 'error'
    });
    expect(close).not.toBeCalled();
  });
});
