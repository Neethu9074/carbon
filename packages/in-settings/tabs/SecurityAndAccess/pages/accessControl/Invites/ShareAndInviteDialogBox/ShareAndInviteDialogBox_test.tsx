/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { useObservable } from '@instana/hooks';

import ShareAndInviteDialogBox from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/ShareAndInviteDialogBox/ShareAndInviteDialogBox';
// @ts-expect-error File needs to be migrated to typescipt
import { useShortUrl } from 'in-components/DashboardHeader/UrlShortener/shortener';
import { getStrippedGroupsAsResultObservable } from 'in-settings/tabs/SecurityAndAccess/api/groups';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
// @ts-expect-error file needs TS migration
import { getUnitKeys } from 'in-api/unitKeys';
import { getInvitations$, getUsersAsResultObservable } from 'in-api/users';
import useIsTeamsAvailable from 'in-settings/hooks/useIsTeamsAvailable';
import { timeConfig$ } from 'in-stores/time/config';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));
jest.mock('in-api/unitKeys', () => ({
  getUnitKeys: jest.fn()
}));
jest.mock('in-components/DashboardHeader/UrlShortener/shortener', () => ({
  useShortUrl: jest.fn()
}));
jest.mock('in-settings/tabs/SecurityAndAccess/api/groups', () => ({
  getStrippedGroupsAsResultObservable: jest.fn()
}));
jest.mock('in-api/users', () => ({
  getUsersAsResultObservable: jest.fn(),
  getInvitations$: jest.fn()
}));
jest.mock('in-stores/time/config', () => {
  const originalModule = jest.requireActual('in-stores/time/config');
  return {
    ...originalModule,
    timeConfig$: jest.fn()
  };
});
jest.mock('in-settings/hooks/useIsTeamsAvailable');

const shortUrlMockData = {
  data: {
    shortUrl: 'https://instana.rocks/s/thisisfake'
  }
};

const groupsMockData = {
  data: [
    {
      id: '1111111111111111111',
      name: '#Test',
      members: [
        {
          userId: '1111111111111111111',
          email: ''
        }
      ],
      permissionSet: null
    }
  ],
  errors: [],
  progress: {
    loading: false
  },
  time: 1718812803829
};

const unitKeysMockData = {
  agentKey: '1111111111111111111',
  downloadKey: '1111111111111111111'
};

const userMockData = {
  data: [
    {
      id: '1111111111111111111',
      email: 'john.doe@ibm.com',
      fullName: 'John Doe',
      lastLoggedIn: 11111111111111,
      groupCount: 1,
      tfaEnabled: false
    }
  ],
  errors: [],
  progress: {
    loading: false
  },
  time: 1718845213299
};

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

const timeConfigMockData = {
  to: null,
  windowSize: 3600000,
  focusedMoment: null,
  autoRefresh: false
};

describe('in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/ShareAndInviteDialogBox/ShareAndInviteDialogBox', () => {
  beforeEach(() => {
    (useIsTeamsAvailable as jest.Mock).mockReturnValue(resultToFetchedStateResponse(success(true)));
    (getUnitKeys as jest.Mock).mockReturnValue(() => unitKeysMockData);
    (getStrippedGroupsAsResultObservable as jest.Mock).mockReturnValue(groupsMockData);
    (getUsersAsResultObservable as jest.Mock).mockReturnValue(userMockData);
    (getInvitations$ as jest.Mock).mockReturnValue(pendingInvitationMock);
    (timeConfig$ as unknown as jest.Mock).mockReturnValue(timeConfigMockData);
    (useShortUrl as jest.Mock).mockReturnValue(() => shortUrlMockData);

    (useObservable as jest.Mock).mockImplementation(callback => {
      if (typeof callback === 'function') return callback();
      return callback;
    });

    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined)
      }
    });
  });

  it('Check if the email message has a placeholder.', () => {
    const { getByPlaceholderText } = render(<ShareAndInviteDialogBox permissionToShowInvite />);
    expect(getByPlaceholderText(t('in-settings:ShareAndInviteDialogBox.defaultEmailMessage'))).toBeInTheDocument();
  });

  it('Check if the number of users that can be added is limited to 5.', () => {
    render(<ShareAndInviteDialogBox permissionToShowInvite />);
    const button = screen.getByText(t('in-settings:ShareAndInviteDialogBox.addUser'));
    expect(button).toBeInTheDocument();
    for (let i = 0; i < 10; i++) {
      fireEvent.click(button);
    }
    const userList = screen.getByTestId('user-list').children.length;
    expect(userList).toBe(5);
  });

  it('Check if clicking the X icon closes the dialog box', () => {
    render(<ShareAndInviteDialogBox permissionToShowInvite />);
    const cancelButton = screen.getByTestId('cancel-button');
    fireEvent.click(cancelButton);
    expect(screen.queryByTestId('share-and-invite-dialog-box')).not.toBeInTheDocument();
  });

  it('Check if shorl URL copy button works', () => {
    render(<ShareAndInviteDialogBox permissionToShowInvite />);
    const shortUrlComponent = screen.getByTestId('short-url-component');
    const inputField = shortUrlComponent.querySelector('input');
    expect(inputField?.value).toBe(shortUrlMockData.data.shortUrl);
    const copyButton = shortUrlComponent.querySelector('button');
    expect(copyButton).not.toBeNull();
    if (copyButton) {
      fireEvent.click(copyButton);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(shortUrlMockData.data.shortUrl);
    }
  });
});
