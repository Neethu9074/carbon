/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { render } from '@testing-library/react';
import React from 'react';

import { addActiveDialog as uO, close as u1 } from 'in-components/DialogPresenter/store';
import InviteUserButton, { onDoInviteUser } from './InviteUserButton';
import { t } from 'in-i18n';

const apiCallResult = {
  body: {
    invitationResults: [
      {
        userEmail: 'lannister@example.com',
        invitationStatus: 'SUCCESS'
      },
      {
        userEmail: 'baratheon@example.com',
        invitationStatus: 'FAILURE_USER_ALREADY_EXISTS'
      }
    ]
  }
};

jest.mock('in-api/users', () => ({
  sendInvitation: jest.fn(() => ({
    once: (onSuccess: (data: any) => void) => onSuccess(apiCallResult),
    errors: () => ({ once: () => {} })
  }))
}));

jest.mock('in-components/DialogPresenter/store', () => ({
  addActiveDialog: jest.fn((d: any) => d),
  close: jest.fn((d: any) => d)
}));

const addActiveDialog = uO as jest.MockedFunction<typeof uO>;
const close = u1 as jest.MockedFunction<typeof u1>;

describe('in-settings/tabs/TeamSettings/pages/accessControl/Invites/InviteUserButton', () => {
  beforeEach(jest.clearAllMocks);

  it('happy day', async () => {
    render(<InviteUserButton setMessage={() => null} reload={null} />);
  });

  it('invite users error', async () => {
    const setMessage = jest.fn();
    const reload = () => {};
    onDoInviteUser(
      setMessage,
      [
        {
          groupId: 'groupId0',
          email: 'lannister@example.com',
          userSentState: 'sentSuccess'
        },
        {
          groupId: 'groupId1',
          email: 'baratheon@example.com',
          userSentState: 'sentFailureUserExists'
        }
      ],
      reload
    );
    const firstCallNonNull: any = addActiveDialog.mock.calls[0][0] ?? {};
    expect(firstCallNonNull.props.previousResult.length).toBe(2);
    expect(firstCallNonNull.props.previousResult[0]).toStrictEqual({
      groupId: 'groupId0',
      email: 'lannister@example.com',
      userSentState: 'sentSuccess'
    });
    expect(firstCallNonNull.props.previousResult[1]).toStrictEqual({
      groupId: 'groupId1',
      email: 'baratheon@example.com',
      userSentState: 'sentFailureUserExists'
    });
    expect(close.mock.calls.length).toBe(1);
    expect(setMessage.mock.calls[0][0]).toMatchObject({
      text: t('in-settings:tabs.sendingInvitation'),
      type: 'success'
    });
  });
});
