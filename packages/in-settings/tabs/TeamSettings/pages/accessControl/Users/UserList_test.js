/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { render } from '@testing-library/react';
import React from 'react';

import { just } from '@instana/observables';

import UserList from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/UserList';
import { getUsersAsResultObservable } from 'in-api/users';
import { success } from 'in-services/util/result';
import useUrlState from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

jest.mock('in-api/users');
// due to some mocking magic going on styleMock, this will not return a string and will break Gravatar
jest.mock('in-components/Gravatar/unknown.png', () => '');

const mockSetUrlState = jest.fn();

jest.mock('in-hooks/useUrlState', () => ({
  default: jest.fn(() => [{}, mockSetUrlState]),
  __esModule: true
}));

describe('in-settings/tabs/TeamSettings/pages/accessControl/Groups/UserList', () => {
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
});
