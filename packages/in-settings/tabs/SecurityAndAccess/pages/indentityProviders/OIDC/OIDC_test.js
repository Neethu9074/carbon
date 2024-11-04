/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { create } from '@instana/observables';

import { getConfigAsResultObservable as getOidcConfig } from 'in-settings/tabs/SecurityAndAccess/api/oidc';
import { getConfigAsResultObservable as getSamlConfig } from 'in-settings/tabs/SecurityAndAccess/api/saml';
import { getConfigAsResultObservable } from 'in-settings/tabs/SecurityAndAccess/api/ldap';
import OIDC from 'in-settings/tabs/SecurityAndAccess/pages/indentityProviders/OIDC/OIDC';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { getInvitations$ } from 'in-api/users';
import { t } from 'in-i18n';

jest.mock('in-settings/tabs/SecurityAndAccess/api/ldap');
jest.mock('in-settings/tabs/SecurityAndAccess/api/oidc');
jest.mock('in-settings/tabs/SecurityAndAccess/api/saml');
jest.mock('in-api/users');
// Fix Trans component, see https://github.com/i18next/react-i18next/issues/434
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key }),
  // eslint-disable-next-line react/display-name
  Trans: () => <></>
}));
jest.mock('in-services/featureFlags', () => ({
  disableInvitesWithIdpEnabled: true
}));
jest.mock('in-components/DialogPresenter/store');

const mockEndpoints = () => {
  const ldap = create();
  ldap.emit({
    data: {
      url: '',
      base: '',
      userDnMapping: '',
      groupQuery: '',
      userQueryTemplate: '',
      emailField: '',
      groupMemberField: '',
      roUser: '',
      userField: '',
      emptyPass: false,
      valid: false,
      groupMemberFieldConfigured: false,
      acceptAnyCA: true
    },
    errors: [],
    progress: {
      loading: false
    },
    time: 1630330080099
  });
  getConfigAsResultObservable.mockReturnValue(ldap);
  const oidc = create();
  oidc.emit({
    data: {
      oidcSignInCallbackUrl: 'https://instana.rocks/auth/signIn/idp/callback?client_name=OidcClientInstana',
      oidcSignOutCallbackUrl: 'https://instana.rocks/auth/signOut/idp/callback',
      spEntityId: 'instana',
      activated: false,
      idpType: '',
      discoveryUri: ''
    },
    errors: [],
    progress: {
      loading: false
    },
    time: 1630330082025
  });

  getOidcConfig.mockReturnValue(oidc);
  const saml = create();
  saml.emit({
    data: {
      oidcSignInCallbackUrl: 'https://instana.rocks/auth/signIn/idp/callback?client_name=OidcClientInstana',
      oidcSignOutCallbackUrl: 'https://instana.rocks/auth/signOut/idp/callback',
      spEntityId: 'instana',
      activated: false,
      idpType: '',
      discoveryUri: ''
    },
    errors: [],
    progress: {
      loading: false
    },
    time: 1630330082025
  });
  getSamlConfig.mockReturnValue(saml);

  getInvitations$.mockReturnValue({
    data: [
      {
        id: '653a871a35c7e0000174ead5',
        email: 'mathieu.figiel@ibm.com',
        groupId: '-3'
      }
    ]
  });
};

describe('in-settings/tabs/SecurityAndAccess/pages/indentityProviders/OIDC/OIDC', () => {
  beforeEach(() => {
    jest.resetModules();
    mockEndpoints();
    addActiveDialog.mockClear();
  });

  it('should show confirmation dialog if there are any pending invitations', () => {
    render(<OIDC invitations={getInvitations$()} />);

    const saveBtn = screen.getByText(t('in-settings:tabs.save'));
    expect(saveBtn).toHaveClass('button-disabled');

    const secretInput = screen.getByLabelText(t('in-settings:tabs.secret')).parentElement.querySelector('input');
    fireEvent.change(secretInput, { target: { value: 'abcdefghij' } });

    const emailInput = screen
      .getByLabelText(t('in-settings:tabs.thisAccountIsAutomaticallyAssignedAnAdminRole'))
      .parentElement.querySelector('input');
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });

    const urlInput = screen.getByText(t('in-settings:tabs.discoveryURL')).parentElement.querySelector('input');
    fireEvent.change(urlInput, { target: { value: 'ldaps://ldap.example.com:636' } });

    expect(saveBtn).not.toHaveClass('button-disabled');
    fireEvent.click(saveBtn);
    expect(addActiveDialog).toHaveBeenCalledTimes(1);
  });
});
