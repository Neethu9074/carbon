/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import CreateSyntheticOnDemandTest from 'in-synthetics/createTests/CreateSyntheticOnDemandTest';
import { t } from 'in-i18n';

describe('CreateSyntheticOnDemandTest', () => {
  it('Run now button gets rendered correctly', () => {
    render(
      <CreateSyntheticOnDemandTest testId="obN1wYkqefH9ZVslLG0L" testLocations={['locations']} testType="HTTPAction" />
    );
    const element = screen.getByRole('button', {
      name: t('in-synthetics:dialog.createOnDemandTest.buttonLabel')
    });
    expect(element).toBeTruthy();
    expect(element).not.toBeDisabled();
    fireEvent.click(element);
  });
});
