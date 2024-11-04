/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { t } from '@instana/i18n-react';

import ExpiryDateTimePicker, {
  ExpiryDateTimePickerProps
} from 'in-settings/components/ApiTokenExpiration/ExpiryDateTimePicker/ExpiryDateTimePicker';
import { createForm } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/ApiToken';

jest.mock('in-services/featureFlags', () => ({
  apiTokenExpirationEnabled: true
}));

describe('in-settings/components/ApiTokenExpiration/ExpiryDateTimePicker/ExpiryDateTimePicker', () => {
  const mockSetState = jest.fn();
  const createToken = {
    name: 'test_name',
    accessGrantingToken: 'test_accessGrantingToken',
    internalId: 'test_internalId',
    id: 'test_id',
    expiresOn: 1724965200000
  };
  const props: ExpiryDateTimePickerProps = {
    form: createForm(createToken),
    setForm: mockSetState
  };
  it('renders ExpiryDateTimePicker', () => {
    const { getByText } = render(<ExpiryDateTimePicker {...props} />);
    expect(getByText(t('in-settings:tabs.apiTokenExpiryDate'))).toBeInTheDocument();
    expect(getByText(t('in-settings:tabs.apiTokenExpiryTime'))).toBeInTheDocument();
  });

  it('updates the state of the form prop passed to the component', () => {
    const { getByTestId } = render(<ExpiryDateTimePicker {...props} />);
    const dateInput = getByTestId('apiTokenExpiryDate');
    fireEvent.change(dateInput, { target: { value: '2023-01-01' } });
    expect(mockSetState).toHaveBeenCalled();
  });
});
