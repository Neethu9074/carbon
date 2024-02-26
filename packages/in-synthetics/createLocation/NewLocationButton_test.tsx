/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import NewLocationButton from 'in-synthetics/createLocation/NewLocationButton';
import { t } from 'in-i18n';

describe('NewLocationButton', () => {
  it('NewLocationButton gets rendered correctly', () => {
    render(<NewLocationButton />);
    const element = screen.getByRole('button', {
      name: t('in-synthetics:dialog.createLocation.newLocation')
    });
    expect(element).toBeTruthy();
    expect(element).not.toBeDisabled();
    fireEvent.click(element);
  });
});
