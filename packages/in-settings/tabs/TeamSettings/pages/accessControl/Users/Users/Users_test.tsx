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

import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { getUsersAsResultObservable } from 'in-api/users';
import Users from './Users';

jest.mock('in-api/users');
jest.mock('in-i18n', () => ({
  t: (key: string) => key
}));

jest.mock('../../Invites/InviteUserDialog');
jest.mock('in-components/Gravatar/unknown.png', () => '');
jest.mock('in-components/DialogPresenter/store');

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
  // @ts-ignore
  getUsersAsResultObservable.mockReturnValue(res);
};

describe('in-settings/tabs/TeamSettings/pages/Users/Users', () => {
  beforeEach(() => {
    jest.resetModules();
    // @ts-ignore
    getUsersAsResultObservable.mockClear();
    // @ts-ignore
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
