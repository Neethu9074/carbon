/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';

import { create } from '@instana/observables';

import { getConfigAsResultObservable as getOidcConfig } from 'in-settings/tabs/SecurityAndAccess/api/oidc';
import { getConfigAsResultObservable as getSamlConfig } from 'in-settings/tabs/SecurityAndAccess/api/saml';
import { getConfigAsResultObservable, getTestResult } from 'in-settings/tabs/SecurityAndAccess/api/ldap';
import Ldap from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/Ldap/Ldap';
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

describe('in-settings/tabs/SecurityAndAccess/pages/indentityProviders/Ldap/Ldap', () => {
  beforeEach(() => {
    jest.resetModules();
    mockEndpoints();
    addActiveDialog.mockClear();
  });

  it('hides user password if read only user is anonymous', async () => {
    render(<Ldap />);

    expect(screen.getByText(t('in-settings:tabs.userDescription'))).toBeInTheDocument();
    const checkbox = screen.getByText(t('in-settings:tabs.anonymous'));
    fireEvent.click(checkbox);
    expect(screen.queryByText(t('in-settings:tabs.userDescription'))).not.toBeInTheDocument();
  });

  it('shows success message on test success', async () => {
    render(<Ldap />);

    expect(screen.getByText(t('in-settings:tabs.testConfiguration'))).toHaveClass('cds--btn--disabled');

    insertUserPassword();

    const successMessage = 'You are an LDAP pro!';
    // Mocks api returning success
    await clickOnTestConfigurationAndSucceed(successMessage);
  });

  it('should be able to set acceptAnyCA to false', async () => {
    render(<Ldap />);
    const checkbox = screen.getByText(t('in-settings:tabs.ldapsAcceptAnyCA'));
    expect(checkbox).toBeInTheDocument();

    insertUserPassword();
    const successMessage = 'You are my LDAP pro!';
    await clickOnTestConfigurationAndSucceed(successMessage);

    fireEvent.click(checkbox);
    await clickOnTestConfigurationAndSucceed(successMessage);
  });

  it('shows spinning icon and disable Test Configuration button while waiting for test response', async () => {
    jest.useFakeTimers();

    render(<Ldap />);

    expect(screen.getByText(t('in-settings:tabs.testConfiguration'))).toHaveClass('cds--btn--disabled');

    insertUserPassword();

    const failReason = 'Oh noes, this config did not work.';

    await clickOnTestConfigurationAndFail(failReason);

    // wait for error message to go away
    act(() => {
      jest.advanceTimersByTime(40000);
    });

    expect(screen.queryByText(`${t('in-settings:tabs.ldapTestFailed')} ${failReason}`)).not.toBeInTheDocument();

    // Testing LDAP configuration and getting the same error should show same error message
    await clickOnTestConfigurationAndFail(failReason);
  });

  it('should show confirmation dialog if there are any pending invitations', () => {
    render(<Ldap invitations={getInvitations$()} />);

    const saveBtn = screen.getByText(t('in-settings:tabs.save'));
    expect(saveBtn).toHaveClass('cds--btn--disabled');

    const urlInput = screen.getByLabelText(t('in-settings:tabs.url'));
    fireEvent.change(urlInput, { target: { value: 'ldaps://ldap.example.com:636' } });

    const userInput = screen.getByLabelText(t('in-settings:tabs.user'));
    fireEvent.change(userInput, { target: { value: 'Hercules' } });

    const pwdInput = screen.getByText(t('in-settings:tabs.passwordDescription')).parentElement.querySelector('input');
    fireEvent.change(pwdInput, { target: { value: 'pass_12' } });

    const baseInput = screen.getByLabelText(t('in-settings:tabs.base'));
    fireEvent.change(baseInput, { target: { value: 'dc=instana' } });

    const grpQueryInput = screen.getByLabelText(t('in-settings:tabs.groupQuery'));
    fireEvent.change(grpQueryInput, { target: { value: 'ou=Instana' } });

    const grpMemberInput = screen.getByLabelText(t('in-settings:tabs.groupMemberField'));
    fireEvent.change(grpMemberInput, { target: { value: 'uniqueMember' } });

    const useQueryTemplateInput = screen.getByLabelText(t('in-settings:tabs.userQueryTemplate'));
    fireEvent.change(useQueryTemplateInput, { target: { value: 'uid=%s' } });

    const emailFieldInput = screen.getByLabelText(t('in-settings:tabs.emailField'));
    fireEvent.change(emailFieldInput, { target: { value: 'mail' } });

    insertUserPassword();

    expect(saveBtn).not.toHaveClass('cds--btn--disabled');
    fireEvent.click(saveBtn);
    expect(addActiveDialog).toHaveBeenCalledTimes(1);
  });

  function insertUserPassword() {
    const userInput = screen.getByLabelText(t('in-settings:tabs.username'));
    fireEvent.change(userInput, { target: { value: 'Hercules' } });
    const passInput = screen
      .getByText(t('in-settings:tabs.usernamePasswordDescription'))
      .parentElement.querySelector('input');
    fireEvent.change(passInput, { target: { value: 'pass_12' } });
    expect(screen.getByText(t('in-settings:tabs.testConfiguration'))).not.toHaveClass('cds--btn--disabled');
  }

  function clickOnTestConfiguration() {
    const testButton = screen.getByText(t('in-settings:tabs.testConfiguration'));
    fireEvent.click(testButton);
    expect(screen.getByText(t('in-settings:tabs.testConfiguration'))).toHaveClass('cds--btn--disabled');
    const spinningIcon = testButton.querySelector('.svg-icon-spinning');
    expect(spinningIcon).toBeInTheDocument();
  }

  async function clickOnTestConfigurationAndFail(failReason) {
    await clickOnTestConfigurationAndExpect(false, failReason, 'message-error');
  }

  async function clickOnTestConfigurationAndSucceed(successMsg) {
    await clickOnTestConfigurationAndExpect(true, successMsg, 'message-success');
  }

  async function clickOnTestConfigurationAndExpect(testPassed, msg, popupClass) {
    const ldapTestResult = create();
    getTestResult.mockReturnValue(ldapTestResult);
    clickOnTestConfiguration();
    // Mocks api returning failure
    await act(() => {
      const updateInput = new Promise((resolve, reject) => {
        ldapTestResult.subscribe(
          data => {
            if (data.testPassed == testPassed && data.reason === msg) {
              resolve();
            } else {
              reject();
            }
          },
          () => reject()
        );
      });

      ldapTestResult.emit({ testPassed: testPassed, reason: msg });
      return updateInput;
    });

    const expectedMsg = popupClass === 'message-error' ? `${t('in-settings:tabs.ldapTestFailed')} ${msg}` : msg;
    const icon = popupClass === 'message-error' ? /error icon/i : /success icon/i;

    expect(screen.getByText(t('in-settings:tabs.testConfiguration'))).not.toHaveClass('cds--btn--disabled');
    expect(screen.getByText(expectedMsg)).toBeInTheDocument();
    expect(screen.getByText(expectedMsg).closest('.carbon-message')).toBeInTheDocument();
    expect(screen.getByText(icon)).toBeValid();
  }
});
