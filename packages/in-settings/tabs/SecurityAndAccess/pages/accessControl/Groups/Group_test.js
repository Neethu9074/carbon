/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { render } from '@testing-library/react';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { create } from '@instana/observables';

import { getGroupWithIdpFlagAsResultObservable } from 'in-settings/tabs/SecurityAndAccess/api/groups';
import Group from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Groups/Group';
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
  it('should render idp flag column when group was mapped by idp', () => {
    const groupScreen = renderGroupWithAUser(true);
    expect(groupScreen.getByText(t('in-settings:tabs.idp')));
  });

  it('should not render idp flag column when group was not mapped by idp', () => {
    const groupScreen = renderGroupWithAUser(false);
    expect(groupScreen.queryByText(t('in-settings:tabs.idp'))).not.toBeInTheDocument();
  });

  it('should render idp flag column for many users that were mapped by idp', () => {
    useUrlState.mockReturnValue([{ query: '', page: 1 }, jest.fn()]);
    const groupsWithIpFlagsOnMembers = create();
    groupsWithIpFlagsOnMembers.emit(
      asLoadedResult({
        id: 'Greendale',
        name: 'Teachers',
        members: [
          { userId: '123', email: 'winger@greendale.edu', joinedViaIdpMapping: true },
          { userId: '456', email: 'chang@greendale.edu', joinedViaIdpMapping: true },
          { userId: '789', email: 'professorson@greendale.edu', joinedViaIdpMapping: false }
        ],
        permissionSet: {
          permissions: [],
          applicationIds: [],
          kubernetesClusterUUIDs: [],
          kubernetesNamespaceUIDs: [],
          websiteIds: [],
          mobileAppIds: [],
          infraDfqFilter: {
            scopeId: '',
            scopeRoleId: '-1'
          }
        }
      })
    );
    getGroupWithIdpFlagAsResultObservable.mockReturnValue(groupsWithIpFlagsOnMembers);

    useObservable.mockReturnValue(
      asLoadedResult([
        { id: '123', email: 'winger@greendale.edu', fullName: 'Jeff Winger' },
        { id: '456', email: 'chang@greendale.edu', fullName: 'Ben Chang' },
        { id: '789', email: 'professorson@greendale.edu', fullName: 'Sean Garrity' }
      ])
    );

    const groupScreen = render(<Group match={{ params: { id: 'Greendale' } }} />);
    const linesWithIdpTrue = groupScreen.getAllByText(t('in-settings:tabs.idp'));
    expect(linesWithIdpTrue).toHaveLength(2);
  });

  function renderGroupWithAUser(joinedViaIdpMapping) {
    useUrlState.mockReturnValue([{ query: '', page: 1 }, jest.fn()]);
    const groupsWithIpFlagsOnMembers = create();
    groupsWithIpFlagsOnMembers.emit(
      asLoadedResult({
        id: 'Greendale',
        name: 'Teachers',
        members: [{ userId: '123', email: 'winger@greendale.edu', joinedViaIdpMapping: joinedViaIdpMapping }],
        permissionSet: {
          permissions: [],
          applicationIds: [],
          kubernetesClusterUUIDs: [],
          kubernetesNamespaceUIDs: [],
          websiteIds: [],
          mobileAppIds: [],
          infraDfqFilter: {
            scopeId: '',
            scopeRoleId: '-1'
          },
          actionFilter: { scopeId: undefined, scopeRoleId: '-1' }
        }
      })
    );
    getGroupWithIdpFlagAsResultObservable.mockReturnValue(groupsWithIpFlagsOnMembers);

    useObservable.mockReturnValue(
      asLoadedResult([
        { id: '123', email: 'winger@greendale.edu', fullName: 'Jeff Winger', lastLoggedIn: 1632798807611 }
      ])
    );

    return render(<Group match={{ params: { id: 'Greendale' } }} />);
  }
});
