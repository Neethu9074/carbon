/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { generateUniqueShortId } from '@instana/utils';
import { create } from '@instana/observables';
import { UserResult } from '@instana/types';

import Users from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Users/Users/Users';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import useIsAnyIdPActive from 'in-settings/hooks/useIsAnyIdPActive';
import { getUsersAsResultObservable } from 'in-api/users';

jest.mock('in-api/users');
jest.mock('in-i18n', () => ({
  ...jest.requireActual('in-i18n'),
  t: (key: string) => key,
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey
}));

jest.mock('in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/InviteUserDialog');
jest.mock('in-components/DialogPresenter/store');

jest.mock('in-services/featureFlags', () => ({
  disableInvitesWithIdpEnabled: true
}));
jest.mock('@instana/hooks');

jest.mock('in-settings/hooks/useIsAnyIdPActive');

const createUserResult = ({
  id = generateUniqueShortId(),
  email = generateUniqueShortId(),
  fullName = generateUniqueShortId(),
  lastLoggedIn = new Date().getTime() - 1000,
  groupCount = 1,
  tfaEnabled = false
}) => ({
  id,
  email,
  fullName,
  lastLoggedIn,
  groupCount,
  tfaEnabled
});

const mockGet = (data: UserResult[]) => {
  const res = create();
  res.emit({ errors: null, progress: { loading: true }, data: null });
  res.emit({
    errors: null,
    progress: { loading: false },
    data
  });
  // @ts-expect-error
  getUsersAsResultObservable.mockReturnValue(res);
};

describe('in-settings/tabs/SecurityAndAccess/pages/Users/Users', () => {
  beforeEach(() => {
    jest.resetModules();
    // @ts-expect-error
    getUsersAsResultObservable.mockClear();
    // @ts-expect-error
    addActiveDialog.mockClear();
  });

  it('should render a table with the expected user', async () => {
    const res = createUserResult({});
    mockGet([res]);

    const { getByPlaceholderText, getByText } = render(<Users />);

    expect(getByText('in-settings:tabs.users (1)')).toBeInTheDocument(); // User title
    expect(getByText('in-settings:tabs.inviteUser')).toBeInTheDocument(); // Invite User btn
    expect(getByPlaceholderText('in-settings:components.search')).toBeInTheDocument(); // Search placeholder
    expect(getByText('in-settings:tabs.name')).toBeInTheDocument(); // Name table column
    expect(getByText('in-settings:tabs.groupCountCol')).toBeInTheDocument(); // Group Count table column
    expect(getByText('in-settings:tabs.tfaEnabledCol')).toBeInTheDocument(); // tfaEnabled table column

    expect(getUsersAsResultObservable).toHaveBeenCalled();

    expect(getByText(res.email)).toBeInTheDocument();
    expect(getByText(res.fullName)).toBeInTheDocument();
    expect(getByText(res.groupCount)).toBeInTheDocument();
  });

  it('should display something for 2fa', async () => {
    const res = createUserResult({ tfaEnabled: true });
    mockGet([res]);

    const { getByText } = render(<Users />);

    expect(getUsersAsResultObservable).toHaveBeenCalled();

    expect(getByText(res.email)).toBeInTheDocument(); // verify data was loaded
    expect(getByText('in-settings:tabs.tfaEnabled')).toBeInTheDocument(); // tfa enabled text
  });

  it('should allow to delete user', async () => {
    const res = createUserResult({});
    mockGet([res]);

    const { container, getByText } = render(<Users />);

    expect(getUsersAsResultObservable).toHaveBeenCalled();

    expect(getByText(res.email)).toBeInTheDocument(); // verify data was loaded
    const deleteBtn = container.querySelector('table tbody tr button');
    expect(deleteBtn).toBeInTheDocument(); // tfa enabled text
    fireEvent.click(deleteBtn!);

    expect(addActiveDialog).toHaveBeenCalledTimes(1);
  });

  it('should allow to invite user', async () => {
    mockGet([]);

    const { getByText } = render(<Users />);

    expect(getUsersAsResultObservable).toHaveBeenCalled();

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

  it('should show invite user button if featureFlag is enabled and none of the IDP is activated', () => {
    // @ts-expect-error
    useIsAnyIdPActive.mockReturnValue(false);

    const res = createUserResult({});
    mockGet([res]);
    const { getByText, queryByText, container } = render(<Users />);
    expect(getUsersAsResultObservable).toHaveBeenCalled();
    const inviteBtn = getByText('in-settings:tabs.inviteUser');
    expect(inviteBtn).toBeInTheDocument();
    const bannerText = queryByText('in-settings:tabs.customUserListInformation');
    expect(bannerText).not.toBeInTheDocument();
    const deleteBtn = container.querySelector('table tbody tr button');
    expect(deleteBtn).toBeInTheDocument();
    fireEvent.click(deleteBtn!);
    expect(addActiveDialog).toHaveBeenCalledTimes(1);
  });

  it('should hide invite user button if featureFlag is enabled and any of the IDP is activated', async () => {
    // @ts-expect-error
    useIsAnyIdPActive.mockReturnValue(true);

    const res = createUserResult({});
    mockGet([res]);
    const { queryByText, container } = render(<Users />);
    expect(getUsersAsResultObservable).toHaveBeenCalled();
    expect(queryByText('in-settings:tabs.inviteUser')).not.toBeInTheDocument();
    expect(queryByText('in-settings:tabs.customUserListInformation')).toBeInTheDocument();
    const deleteBtn = container.querySelector('table tbody tr button');
    expect(deleteBtn).toBeInTheDocument();
    fireEvent.click(deleteBtn!);
    expect(addActiveDialog).toHaveBeenCalledTimes(1);
  });
});
