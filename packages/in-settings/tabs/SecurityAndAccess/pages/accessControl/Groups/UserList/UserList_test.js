/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { render } from '@testing-library/react';
import React from 'react';

import { just } from '@instana/observables';

import UserList from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Groups/UserList';
import { getUsersAsResultObservable } from 'in-api/users';
import { success } from 'in-services/util/result';
import useUrlState from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

jest.mock('in-api/users');

const mockSetUrlState = jest.fn();

jest.mock('in-hooks/useUrlState', () => ({
  default: jest.fn(() => [{}, mockSetUrlState]),
  __esModule: true
}));

describe('in-settings/tabs/SecurityAndAccess/pages/accessControl/Groups/UserList', () => {
  it('should not render group count for users if unavailable', () => {
    useUrlState.mockReturnValue([{}, jest.fn()]);
    getUsersAsResultObservable.mockReturnValue(
      just(
        success([
          {
            id: '42',
            email: 'rick@example.com',
            fullName: 'Rick S',
            lastLoggedIn: 0
          }
        ])
      )
    );

    const groupScreen = render(<UserList />);
    expect(groupScreen.queryByText(t('in-settings:tabs.groups'))).not.toBeInTheDocument();
  });

  it('should render group count for users', () => {
    useUrlState.mockReturnValue([{}, jest.fn()]);

    getUsersAsResultObservable.mockReturnValue(
      just(
        success([
          {
            id: '42',
            email: 'morty@example.com',
            fullName: 'Morty S',
            groupCount: 9987,
            lastLoggedIn: 0
          }
        ])
      )
    );

    const groupScreen = render(<UserList />);
    expect(groupScreen.queryByText(t('in-settings:tabs.groups'))).toBeInTheDocument();
    expect(groupScreen.queryByText('9987')).toBeInTheDocument();
  });

  it('should render the 2faEnabled info if available for the user', () => {
    useUrlState.mockReturnValue([{}, jest.fn()]);

    getUsersAsResultObservable.mockReturnValue(
      just(
        success([
          {
            id: '43',
            email: 'rick@example.com',
            fullName: 'Rick E',
            groupCount: 17,
            lastLoggedIn: 0,
            tfaEnabled: true
          }
        ])
      )
    );

    const { getByText } = render(<UserList />);
    expect(getByText(t('in-settings:tabs.groups'))).toBeInTheDocument();
    expect(getByText('17')).toBeInTheDocument();
    expect(getByText(t('in-settings:tabs.tfaEnabled'))).toBeInTheDocument();
  });

  it('should ignore the 2faEnabled info if not enabled for the user', () => {
    useUrlState.mockReturnValue([{}, jest.fn()]);

    getUsersAsResultObservable.mockReturnValue(
      just(
        success([
          {
            id: '44',
            email: 'harry@example.com',
            fullName: 'Harry',
            groupCount: 3,
            lastLoggedIn: 0,
            tfaEnabled: false
          }
        ])
      )
    );

    const { getByText, queryAllByText } = render(<UserList />);
    expect(getByText(t('in-settings:tabs.groups'))).toBeInTheDocument();
    expect(getByText('3')).toBeInTheDocument();
    expect(queryAllByText(t('in-settings:tabs.tfaEnabled'))).toHaveLength(0);
  });
});
