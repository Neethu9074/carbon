/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import ShowHideInputField from 'in-settings/components/ShowHideInputField/ShowHideInputField';

describe('in-settings/components/ShowHideInputField', () => {
  test('should allow toggling on eye icon button click', async () => {
    const inputProps = {
      id: 'newPassword',
      value: '',
      autoComplete: 'off',
      labelText: 'new Password'
    };

    const { container } = render(<ShowHideInputField {...inputProps} />);

    const inputValue = container.querySelector('.cds--password-input') as HTMLElement;
    userEvent.type(inputValue, 'new value');
    const button = await screen.findByRole('button');
    userEvent.click(button);

    expect(inputValue).toHaveAttribute('type', 'password');
  });
});
