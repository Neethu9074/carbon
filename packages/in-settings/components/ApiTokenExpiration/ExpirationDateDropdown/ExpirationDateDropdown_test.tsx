/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import ExpirationDateDropdown from 'in-settings/components/ApiTokenExpiration/ExpirationDateDropdown/ExpirationDateDropdown';
import { createForm } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/ApiToken';
import { t } from 'in-i18n';

jest.mock('in-services/featureFlags', () => ({
  apiTokenExpirationEnabled: true
}));
describe('in-settings/components/ApiTokenExpiration/ExpirationDateDropdown/ExpirationDateDropdown', () => {
  const createToken = {
    name: 'test_name',
    accessGrantingToken: 'test_accessGrantingToken',
    internalId: 'test_internalId',
    id: 'test_id'
  };
  const props = {
    form: createForm(createToken),
    setForm: jest.fn(),
    id: 'mockId'
  };
  it('renders the dropdown menu', () => {
    render(<ExpirationDateDropdown {...props} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders the custom expiration option', () => {
    render(<ExpirationDateDropdown {...props} />);

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Custom' } });

    expect(screen.getByText(t('in-settings:tabs.apiTokenExpirationOptions.custom'))).toBeInTheDocument();
  });
});
