/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { LdapConfig } from '@instana/types';

import {
  getConfigAsResultObservableInternal,
  getTestResultV2 as getTestResult,
  setConfigV2 as setConfig
} from 'in-settings/tabs/SecurityAndAccess/api/ldap';
import LdapDialog from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/Ldap/LdapDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { successObservable } from 'in-services/util/result';
import { getInvitations$ } from 'in-api/users';
import { t } from 'in-i18n';

jest.mock('in-settings/tabs/SecurityAndAccess/api/ldap');
jest.mock('in-api/users');
jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));
jest.mock('in-services/featureFlags', () => ({
  disableInvitesWithIdpEnabled: true
}));
jest.mock('in-components/DialogPresenter/store');

const ldapConfig: LdapConfig = {
  url: '',
  base: '',
  userDnMapping: '',
  groupQuery: '',
  userQueryTemplate: '',
  emailField: '',
  groupMemberField: '',
  roUser: '',
  roPassword: '',
  userField: '',
  emptyPass: false,
  groupMemberFieldConfigured: false,
  acceptAnyCA: true
};
const invitationMockData = {
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

const ldapMockData = {
  data: ldapConfig,
  errors: [],
  progress: {
    loading: false
  },
  time: 1718845213057
};

const ldapActiveConfig: LdapConfig = {
  url: 'testUrl',
  base: 'dc=example,dc=com',
  userDnMapping: '',
  groupQuery: 'groupQuery',
  userQueryTemplate: '',
  emailField: 'emailField',
  groupMemberField: '',
  roUser: 'test',
  roPassword: 'testPwd',
  userField: '',
  emptyPass: false,
  groupMemberFieldConfigured: false,
  acceptAnyCA: true
};
const ldapActiveMockData = {
  data: ldapActiveConfig,
  errors: [],
  progress: {
    loading: false
  },
  time: 1718845213057
};

describe('in-settings/tabs/SecurityAndAccess/pages/identityProviders/Ldap/LdapDialog', () => {
  beforeEach(() => {
    jest.resetModules();
    (getInvitations$ as jest.Mock).mockReturnValue(invitationMockData);
    (getConfigAsResultObservableInternal as jest.Mock).mockReturnValue(ldapMockData);
    (useObservable as jest.Mock).mockImplementation(callback => {
      if (typeof callback === 'function') return callback();
      return callback;
    });
  });

  it('should show user password if read only access to LDAP is enabled', async () => {
    // Given
    const isActive = false;
    const onFormUpdate = jest.fn();

    // When
    render(<LdapDialog isActive={isActive} onFormUpdate={onFormUpdate} />);
    const toggelButton = screen.getByText(t('in-settings:tabs.user'));
    fireEvent.click(toggelButton);

    // Then
    expect(screen.getByText(t('in-settings:tabs.ldapForm.authenticateReadOnlyAccessToLdap'))).toBeInTheDocument();
    expect(screen.queryByText(t('in-settings:tabs.userDescription'))).not.toBeInTheDocument();
  });

  it('should show success notification on test connection success', async () => {
    // Given
    const isActive = false;
    const onFormUpdate = jest.fn();
    // mock ldapTestResult api
    const testConfig = { testPassed: true, reason: 'Test succeeded' };
    (getTestResult as jest.Mock).mockReturnValue(successObservable(testConfig));

    // When
    render(<LdapDialog isActive={isActive} onFormUpdate={onFormUpdate} />);

    const testConfigurationBtn = screen.getByRole('button', { name: t('in-settings:tabs.ldapForm.testConnection') });
    expect(testConfigurationBtn).toHaveClass('cds--btn--disabled');

    const userInput = screen.getByLabelText(t('in-settings:tabs.ldapForm.usernameAdministrationAccess'));
    fireEvent.change(userInput, { target: { value: 'Hercules2' } });
    const passwordInput = screen.getByLabelText(t('in-settings:tabs.ldapForm.passwordAdministrationAccess'));
    fireEvent.change(passwordInput, { target: { value: 'pass_122' } });
    expect(testConfigurationBtn).not.toHaveClass('cds--btn--disabled');

    fireEvent.click(testConfigurationBtn);

    // Then
    const notification = document.getElementsByClassName('cds--inline-notification__subtitle')[0];
    expect(notification).toHaveTextContent(testConfig.reason);
  });

  it('should show error notification on test connection failure', async () => {
    // Given
    const isActive = false;
    const onFormUpdate = jest.fn();
    const testConfigfailed = { testPassed: false, reason: 'Test failed' };
    (getTestResult as jest.Mock).mockReturnValue(successObservable(testConfigfailed));

    // When
    render(<LdapDialog isActive={isActive} onFormUpdate={onFormUpdate} />);

    const userInput = screen.getByLabelText(t('in-settings:tabs.ldapForm.usernameAdministrationAccess'));
    fireEvent.change(userInput, { target: { value: 'test' } });
    const passwordInput = screen.getByLabelText(t('in-settings:tabs.ldapForm.passwordAdministrationAccess'));
    fireEvent.change(passwordInput, { target: { value: 'pass_123' } });
    const testConfigurationBtn = screen.getByRole('button', { name: t('in-settings:tabs.ldapForm.testConnection') });
    fireEvent.click(testConfigurationBtn);

    // Then
    const notification = document.getElementsByClassName('cds--inline-notification__subtitle')[0];
    expect(notification).toHaveTextContent(testConfigfailed.reason);
  });

  it('should show confirmation dialog if there are any pending invitations', () => {
    // Given
    const isActive = false;
    const onFormUpdate = jest.fn();

    // When
    render(<LdapDialog isActive={isActive} onFormUpdate={onFormUpdate} />);

    const saveBtn = screen.getByText(t('in-settings:tabs.save'));

    const urlInput = screen.getByLabelText(t('in-settings:tabs.url'));
    fireEvent.change(urlInput, { target: { value: 'ldaps://ldap.example.com:636' } });

    const userInput = screen.getByLabelText(t('in-settings:tabs.user'));
    fireEvent.change(userInput, { target: { value: 'cn=read-only-test,dc=example' } });

    const pwdInput = screen.getByLabelText(t('in-settings:tabs.ldapForm.passwordForReadOnlyUser'));
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

    const roUser = screen.getByLabelText(t('in-settings:tabs.ldapForm.usernameAdministrationAccess'));
    fireEvent.change(roUser, { target: { value: 'Hercules2' } });
    const roPassword = screen.getByLabelText(t('in-settings:tabs.ldapForm.passwordAdministrationAccess'));
    fireEvent.change(roPassword, { target: { value: 'pass_122' } });

    fireEvent.click(saveBtn);
    (setConfig as jest.Mock).mockReturnValue(successObservable(true));

    // Then
    expect(saveBtn).not.toHaveClass('cds--btn--disabled');
    expect(addActiveDialog).toHaveBeenCalledTimes(1);
  });

  it('should show readonly form if LDAP active', async () => {
    // Given
    const isActive = true;
    const onFormUpdate = jest.fn();
    (getConfigAsResultObservableInternal as jest.Mock).mockReturnValue(ldapActiveMockData);

    // When
    render(<LdapDialog isActive={isActive} onFormUpdate={onFormUpdate} />);

    const ldapActiveMessage = screen.getByText(
      t('in-settings:tabs.authenticationProviders.idpIsActive', { idpConfig: 'LDAP' })
    );
    const deleteButton = screen.queryByText(t('in-settings:components.delete'));

    // Then
    expect(ldapActiveMessage).toBeInTheDocument();
    expect(deleteButton).toHaveClass('cds--btn--disabled');
  });

  it('should enable delete button only if ldap active and checkbox is checked', async () => {
    // Given
    const isActive = true;
    const onFormUpdate = jest.fn();
    (getConfigAsResultObservableInternal as jest.Mock).mockReturnValue(ldapActiveMockData);

    // When
    render(<LdapDialog isActive={isActive} onFormUpdate={onFormUpdate} />);
    const deleteButton = screen.queryByText(t('in-settings:components.delete'));
    const deleteEnableCheckBox = screen.getByText(t('in-settings:tabs.authenticationProviders.actionCannotBeUndone'));

    fireEvent.click(deleteEnableCheckBox);

    // Then
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).not.toHaveClass('cds--btn--disabled');
  });
});
