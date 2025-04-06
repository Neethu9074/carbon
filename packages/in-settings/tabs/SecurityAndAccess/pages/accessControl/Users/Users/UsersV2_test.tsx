/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { AuthenticationOverview } from '@instana/types';
import { useObservable } from '@instana/hooks';

import Users from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Users/Users/UsersV2';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import useAuthOverview from 'in-settings/hooks/useAuthOverview';
import { success } from 'in-services/util/result';

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

jest.mock('@instana/hooks');

jest.mock('in-settings/hooks/useAuthOverview');

const usersMockData = {
  data: [
    {
      id: '43',
      email: 'rick@example.com',
      fullName: 'Rick E',
      groupCount: 17,
      lastLoggedIn: 0,
      tfaEnabled: true
    }
  ],
  errors: [],
  progress: {
    loading: false
  },
  time: 1718845213876
};
const res = usersMockData.data[0];

describe('in-settings/tabs/SecurityAndAccess/pages/Users/Users', () => {
  beforeEach(() => {
    (useObservable as jest.Mock).mockImplementation(() => usersMockData);
    // @ts-expect-error
    addActiveDialog.mockClear();

    (useAuthOverview as jest.Mock).mockReturnValue(
      resultToFetchedStateResponse(
        success<AuthenticationOverview>({
          defaultLogin: true
        })
      )
    );
  });
  it('should render a table with the expected user', async () => {
    const { getByPlaceholderText, getByText } = render(<Users />);

    expect(getByText('in-settings:tabs.users (1)')).toBeInTheDocument(); // User title
    expect(getByText('in-settings:tabs.inviteUser')).toBeInTheDocument(); // Invite User btn
    expect(getByPlaceholderText('in-settings:components.search')).toBeInTheDocument(); // Search placeholder
    expect(getByText('in-settings:tabs.name')).toBeInTheDocument(); // Name table column
    expect(getByText('in-settings:tabs.groupCountCol')).toBeInTheDocument(); // Group Count table column
    expect(getByText('in-settings:tabs.tfaEnabledCol')).toBeInTheDocument(); // tfaEnabled table column

    expect(getByText(res.email)).toBeInTheDocument();
    expect(getByText(res.fullName)).toBeInTheDocument();
    expect(getByText(res.groupCount)).toBeInTheDocument();
  });

  it('should display something for 2fa', async () => {
    const { getByText } = render(<Users />);

    expect(getByText(res.email)).toBeInTheDocument(); // verify data was loaded
    expect(getByText('in-settings:tabs.tfaEnabled')).toBeInTheDocument(); // tfa enabled text
  });

  it('should allow to delete user', async () => {
    const { container, getByText } = render(<Users />);

    expect(getByText(res.email)).toBeInTheDocument(); // verify data was loaded
    const deleteBtn = container.querySelector('table tbody tr button');
    expect(deleteBtn).toBeInTheDocument(); // tfa enabled text
    fireEvent.click(deleteBtn!);

    expect(addActiveDialog).toHaveBeenCalledTimes(1);
  });

  it('should allow to invite user', async () => {
    const { getByText } = render(<Users />);

    const inviteBtn = getByText('in-settings:tabs.inviteUser');
    expect(inviteBtn).toBeInTheDocument(); // Invite User btn
    fireEvent.click(inviteBtn!);

    expect(addActiveDialog).toHaveBeenCalledTimes(1);
  });
});

describe('in-settings/tabs/SecurityAndAccess/pages/Users/Users', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show invite user button if defaultLogin is set to true', () => {
    (useAuthOverview as jest.Mock).mockReturnValue(
      resultToFetchedStateResponse(
        success<AuthenticationOverview>({
          defaultLogin: true
        })
      )
    );

    const { getByText, queryByText, container } = render(<Users />);

    const inviteBtn = getByText('in-settings:tabs.inviteUser');
    const bannerText = queryByText('in-settings:tabs.customUserListInformation');
    const deleteBtn = container.querySelector('table tbody tr button');

    expect(inviteBtn).toBeInTheDocument();
    expect(bannerText).not.toBeInTheDocument();
    expect(deleteBtn).toBeInTheDocument();

    fireEvent.click(deleteBtn!);
    expect(addActiveDialog).toHaveBeenCalledTimes(1);
  });

  it('should hide invite user button if defaultLogin is false', async () => {
    (useAuthOverview as jest.Mock).mockReturnValue(
      resultToFetchedStateResponse(
        success<AuthenticationOverview>({
          defaultLogin: false
        })
      )
    );

    const { queryByText, container } = render(<Users />);
    expect(queryByText('in-settings:tabs.inviteUser')).not.toBeInTheDocument();
    expect(queryByText('in-settings:tabs.customUserListInformation')).toBeInTheDocument();

    const deleteBtn = container.querySelector('table tbody tr button');
    expect(deleteBtn).toBeInTheDocument();
    fireEvent.click(deleteBtn!);
    expect(addActiveDialog).toHaveBeenCalledTimes(1);
  });
});
