/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import CustomizationConfiguration from 'in-synthetics/createTests/dialog/CreateSyntheticOnDemandTestDialogPresenter';
import { createRunNowForm } from 'in-synthetics/createTests/form/createRunNowTestForm';
import { t } from 'in-i18n';

describe('Synthetic New Run now test Dialog', () => {
  const form = createRunNowForm([]);
  const updateForm = jest.fn();
  it('Renders the run now dialog title correctly', () => {
    render(
      <CustomizationConfiguration form={form} updateForm={updateForm} testLocations={['']} onlineLocations={[]} />
    );
    expect(screen.getByText(t('in-synthetics:dialog.createOnDemandTest.location'))).toBeInTheDocument();
    expect(
      screen.getByText(t('in-synthetics:dialog.createTest.advancedMode.configStep.timeoutAndRetrySectionLabel'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-synthetics:dialog.createTest.advancedMode.configStep.retryFieldLabel'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-synthetics:dialog.createTest.advancedMode.customPropertiesTitle'))
    ).toBeInTheDocument();
  });
});
