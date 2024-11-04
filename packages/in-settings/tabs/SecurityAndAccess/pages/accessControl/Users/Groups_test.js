/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { render } from '@testing-library/react';
import React from 'react';

import { useObservable } from '@instana/hooks';

import Groups from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Users/Groups';
import useUrlState from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

jest.mock('in-hooks/useUrlState');
jest.mock('in-settings/tabs/SecurityAndAccess/api/groups');
jest.mock('in-api/users');
jest.mock('@instana/hooks');

function asLoadedResult(data) {
  return {
    progress: {
      loading: false
    },
    errors: [],
    data
  };
}

describe('in-settings/tabs/SecurityAndAccess/pages/accessControl/Groups/Group', () => {
  const USER_ID = '123';
  it('should render idp flag column when group was mapped by idp', () => {
    useUrlState.mockReturnValue([{ query: '', page: 1 }, jest.fn()]);
    useObservable.mockReturnValue(
      asLoadedResult([
        {
          id: 'GreendaleTeachers',
          name: 'Teachers',
          members: [{ userId: USER_ID, email: 'winger@greendale.edu' }],
          joinedViaIdpMapping: true
        },
        {
          id: 'GreendaleStudents',
          name: 'Students',
          members: [{ userId: USER_ID, email: 'winger@greendale.edu' }],
          joinedViaIdpMapping: true
        }
      ])
    );

    const groupScreen = render(<Groups userId={USER_ID} />);
    const linesWithIdpTrue = groupScreen.getAllByText(t('in-settings:tabs.idp'));
    expect(linesWithIdpTrue).toHaveLength(2);
  });

  it('should render idp flag column when group was mapped by idp', () => {
    useUrlState.mockReturnValue([{ query: '', page: 1 }, jest.fn()]);
    useObservable.mockReturnValue(
      asLoadedResult([
        {
          id: 'GreendaleTeachers',
          name: 'Teachers',
          members: [{ userId: USER_ID, email: 'winger@greendale.edu' }],
          joinedViaIdpMapping: true
        },
        {
          id: 'GreendaleStudents',
          name: 'Students',
          members: [{ userId: USER_ID, email: 'winger@greendale.edu' }],
          joinedViaIdpMapping: false
        }
      ])
    );

    const groupScreen = render(<Groups userId={USER_ID} />);
    expect(groupScreen.getByText(t('in-settings:tabs.idp')));
  });

  it('should not render idp flag column when group was not mapped by idp', () => {
    useUrlState.mockReturnValue([{ query: '', page: 1 }, jest.fn()]);
    useObservable.mockReturnValue(
      asLoadedResult([
        {
          id: 'GreendaleTeachers',
          name: 'Teachers',
          members: [{ userId: USER_ID, email: 'winger@greendale.edu' }],
          joinedViaIdpMapping: false
        },
        {
          id: 'GreendaleStudents',
          name: 'Students',
          members: [{ userId: USER_ID, email: 'winger@greendale.edu' }],
          joinedViaIdpMapping: false
        }
      ])
    );

    const groupScreen = render(<Groups userId={USER_ID} />);
    expect(groupScreen.queryByText(t('in-settings:tabs.idp'))).not.toBeInTheDocument();
  });
});
