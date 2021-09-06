/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import { create } from '@instana/observables';

import { getConfigAsResultObservable as getOidcConfig } from 'in-settings/tabs/AuthSettings/api/oidc';
import { getConfigAsResultObservable as getSamlConfig } from 'in-settings/tabs/AuthSettings/api/saml';
import { getConfigAsResultObservable, getTestResult } from 'in-settings/tabs/AuthSettings/api/ldap';
import { t } from 'in-i18n';
import Ldap from './Ldap';

jest.mock('in-settings/tabs/AuthSettings/api/ldap');
jest.mock('in-settings/tabs/AuthSettings/api/oidc');
jest.mock('in-settings/tabs/AuthSettings/api/saml');

// Fix Trans component, see https://github.com/i18next/react-i18next/issues/434
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key }),
  // eslint-disable-next-line react/display-name
  Trans: () => <></>
}));

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
      groupMemberFieldConfigured: false
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
};

describe('in-settings/tabs/AuthSettings/pages/indentityProviders/Ldap/Ldap', () => {
  beforeEach(() => {
    jest.resetModules();
    mockEndpoints();
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

    expect(screen.getByText(t('in-settings:tabs.testConfiguration'))).toHaveClass('button-disabled');

    insertUserPassword();

    const successMessage = 'You are an LDAP pro!';
    // Mocks api returning success
    await clickOnTestConfigurationAndSucceed(successMessage);
  });

  it('shows spinning icon and disable Test Configuration button while waiting for test response', async () => {
    jest.useFakeTimers();

    render(<Ldap />);

    expect(screen.getByText(t('in-settings:tabs.testConfiguration'))).toHaveClass('button-disabled');

    insertUserPassword();

    const failReason = 'Oh noes, this config did not work.';

    await clickOnTestConfigurationAndFail(failReason);

    // wait for error message to go away
    act(() => {
      jest.advanceTimersByTime(40000);
    });

    expect(screen.queryByText(failReason)).not.toBeInTheDocument();

    // Testing LDAP configuration and getting the same error should show same error message
    await clickOnTestConfigurationAndFail(failReason);
  });

  function insertUserPassword() {
    const userInput = screen.getByLabelText(t('in-settings:tabs.username'));
    fireEvent.change(userInput, { target: { value: 'Hercules' } });
    const passInput = screen
      .getByText(t('in-settings:tabs.usernamePasswordDescription'))
      .parentElement.querySelector('input');
    fireEvent.change(passInput, { target: { value: 'pass_12' } });
    expect(screen.getByText(t('in-settings:tabs.testConfiguration'))).not.toHaveClass('button-disabled');
  }

  function clickOnTestConfiguration() {
    const testButton = screen.getByText(t('in-settings:tabs.testConfiguration'));
    fireEvent.click(testButton);
    expect(screen.getByText(t('in-settings:tabs.testConfiguration'))).toHaveClass('button-disabled');
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

    expect(screen.getByText(t('in-settings:tabs.testConfiguration'))).not.toHaveClass('button-disabled');
    expect(screen.getByText(msg)).toBeInTheDocument();
    expect(screen.getByText(msg).closest('.' + popupClass)).toBeInTheDocument();
  }
});
