/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { useObservable } from '@instana/hooks';

import OIDCDialog from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/OIDC/OIDCDialog';
import { getConfigAsResultObservableInternal } from 'in-settings/tabs/SecurityAndAccess/api/oidc';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { OidcApiResponseConfig } from 'in-types';
import { getInvitations$ } from 'in-api/users';
import { t } from 'in-i18n';

jest.mock('in-settings/tabs/SecurityAndAccess/api/oidc');
jest.mock('in-api/users');
jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));
jest.mock('in-components/DialogPresenter/store');

const oidcActiveResponse: OidcApiResponseConfig = {
  oidcSignInCallbackUrl: 'https://instana.rocks/auth/signIn/idp/callback?client_name=OidcClientInstana',
  oidcSignOutCallbackUrl: 'https://instana.rocks/auth/signOut/idp/callback',
  spEntityId: 'instana',
  activated: true,
  idpType: 'KEYCLOAK',
  discoveryUri: 'https://testURL'
};
const oidcMockData = {
  data: oidcActiveResponse,
  errors: [],
  progress: {
    loading: false
  },
  time: 1718845213057
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

describe('in-settings/tabs/SecurityAndAccess/pages/identityProviders/OIDC/OIDCDialog', () => {
  beforeEach(() => {
    jest.resetModules();
    (getInvitations$ as jest.Mock).mockReturnValue(invitationMockData);
    (useObservable as jest.Mock).mockImplementation(callback => {
      if (typeof callback === 'function') return callback();
      return callback;
    });
  });

  it('should show confirmation dialog if there are any pending invitations', async () => {
    // Given
    const oidcConfig: OidcApiResponseConfig = {
      oidcSignInCallbackUrl: 'https://instana.rocks/auth/signIn/idp/callback?client_name=OidcClientInstana',
      oidcSignOutCallbackUrl: 'https://instana.rocks/auth/signOut/idp/callback',
      spEntityId: 'instana',
      activated: false,
      idpType: '',
      discoveryUri: ''
    };
    const oidcMockData = {
      data: oidcConfig,
      errors: [],
      progress: {
        loading: false
      },
      time: 1718845213057
    };
    (getConfigAsResultObservableInternal as jest.Mock).mockReturnValue(oidcMockData);
    const isActive = false;
    const onFormUpdate = jest.fn();

    // When
    render(<OIDCDialog onFormUpdate={onFormUpdate} isActive={isActive} />);

    const saveBtn = screen.getByText(t('in-settings:tabs.save'));
    const secretInput = screen.getByLabelText(t('in-settings:tabs.secret'));
    const emailInput = screen.getByLabelText(
      t('in-settings:tabs.authenticationProviders.emailToRecieveAdminstrationAccess')
    );
    const urlInput = screen.getByLabelText(t('in-settings:tabs.discoveryURL'));
    fireEvent.change(secretInput, { target: { value: 'abcdefghij' } });
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(urlInput, { target: { value: 'https://testURL' } });
    fireEvent.click(saveBtn);

    // Then
    expect(addActiveDialog).toHaveBeenCalledTimes(1);
  });

  it('should show readonly form if oidc active', async () => {
    // Given
    const isActive = true;
    const onFormUpdate = jest.fn();
    (getConfigAsResultObservableInternal as jest.Mock).mockReturnValue(oidcMockData);

    // When
    render(<OIDCDialog onFormUpdate={onFormUpdate} isActive={isActive} />);

    const oidcActiveMessage = screen.getByText(
      t('in-settings:tabs.authenticationProviders.idpIsActive', { idpConfig: 'OIDC' })
    );
    const deleteButton = screen.queryByText(t('in-settings:components.delete'));

    // Then
    expect(oidcActiveMessage).toBeInTheDocument();
    expect(deleteButton).toHaveClass('cds--btn--disabled');
  });

  it('should enable delete button only if oidc active and checkbox is checked', async () => {
    // Given
    const isActive = true;
    const onFormUpdate = jest.fn();
    (getConfigAsResultObservableInternal as jest.Mock).mockReturnValue(oidcMockData);

    // When
    render(<OIDCDialog onFormUpdate={onFormUpdate} isActive={isActive} />);

    const deleteEnableCheckBox = screen.getByText(t('in-settings:tabs.authenticationProviders.actionCannotBeUndone'));
    const deleteButton = screen.queryByText(t('in-settings:components.delete'));
    fireEvent.click(deleteEnableCheckBox);

    // Then
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).not.toHaveClass('cds--btn--disabled');
  });
});
