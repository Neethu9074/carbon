/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { useObservable } from '@instana/hooks';

import InviteV2 from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/InvitesV2';
import { addActiveDialog } from 'in-components/DialogPresenter/store';

jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));
jest.mock('in-api/users');
jest.mock('in-i18n', () => ({
  ...jest.requireActual('in-i18n'),
  t: (key: string) => key,
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey
}));

jest.mock('in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/InviteUserDialog');
jest.mock('in-components/DialogPresenter/store');

const pendingInvitationMock = {
  data: [
    {
      id: '1111111111111111111',
      email: 'jane.doe@ibm.com',
      groupId: '-3',
      groupName: 'Default',
      invitedBy: 'John',
      expireAt: 1719504233698
    }
  ],
  errors: [],
  progress: {
    loading: false
  },
  time: 1718845213876
};

const res = pendingInvitationMock.data[0];

describe('in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/InvitesV2', () => {
  beforeEach(() => {
    (useObservable as jest.Mock).mockImplementation(() => pendingInvitationMock);
    // @ts-expect-error
    addActiveDialog.mockClear();
  });
  it('should render a table with the pending invites', async () => {
    const { getByPlaceholderText, getByText } = render(<InviteV2 />);

    expect(getByText('in-settings:tabs.pendingInvitations (1)')).toBeInTheDocument(); // PendingInvitations title
    expect(getByText('in-settings:tabs.inviteUser')).toBeInTheDocument(); // Invite User btn
    expect(getByPlaceholderText('in-settings:components.search')).toBeInTheDocument();
    expect(getByText('in-settings:tabs.email')).toBeInTheDocument();
    expect(getByText('in-settings:tabs.group')).toBeInTheDocument();
    expect(getByText('in-settings:tabs.invitationValidUntil')).toBeInTheDocument();

    expect(getByText(res.email)).toBeInTheDocument();
    expect(getByText(res.invitedBy)).toBeInTheDocument();
    expect(getByText(res.groupName)).toBeInTheDocument();
  });

  it('should allow to delete pending invite', async () => {
    const { container, getByText } = render(<InviteV2 />);

    expect(getByText(res.email)).toBeInTheDocument(); // verify data was loaded
    const deleteBtn = container.querySelector('table tbody tr button');
    expect(deleteBtn).toBeInTheDocument();
    fireEvent.click(deleteBtn!);

    expect(addActiveDialog).toHaveBeenCalledTimes(1);
  });

  it('should allow to invite user', async () => {
    const { getByText } = render(<InviteV2 />);

    const inviteBtn = getByText('in-settings:tabs.inviteUser');
    expect(inviteBtn).toBeInTheDocument(); // Invite User btn
    fireEvent.click(inviteBtn!);

    expect(addActiveDialog).toHaveBeenCalledTimes(1);
  });
});
