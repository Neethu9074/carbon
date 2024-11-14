/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { userEvent } from '@testing-library/user-event';
import { render } from '@testing-library/react';
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
  let futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 1);
  const createToken = {
    name: 'test_name',
    accessGrantingToken: 'test_accessGrantingToken',
    internalId: 'test_internalId',
    id: 'test_id',
    expiresOn: futureDate.getTime()
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

  it('updates the state of the form prop passed to the component', async () => {
    const { getByPlaceholderText } = render(<ExpiryDateTimePicker {...props} />);
    const dateInput: HTMLInputElement = getByPlaceholderText(/yyyy-mm-dd/i) as HTMLInputElement;

    // set date in future
    const dateString = futureDate.toISOString().slice(0, 10);

    await userEvent.type(dateInput, `${dateString}{enter}`);
    expect(mockSetState).toHaveBeenCalled();
    expect(dateInput.value).toBe(dateString);
  });
});
