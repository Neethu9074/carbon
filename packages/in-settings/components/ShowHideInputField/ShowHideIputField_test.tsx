/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { render, fireEvent, screen } from '@testing-library/react';
import React from 'react';

import ShowHideInputField from 'in-settings/components/ShowHideInputField/ShowHideInputField';

describe('in-settings/components/ShowHideInputField', () => {
  test('should allow toggling on eye icon button click', async () => {
    const { container } = render(<ShowHideInputField />);
    const inputValue = container.querySelector('.local-css-input') as HTMLElement;

    fireEvent.change(inputValue, { target: { value: 'test' } });
    fireEvent.click(container.querySelector('button') as HTMLElement);

    const input = await screen.findByRole('textbox');
    expect(input).toHaveValue('test');
  });
});
