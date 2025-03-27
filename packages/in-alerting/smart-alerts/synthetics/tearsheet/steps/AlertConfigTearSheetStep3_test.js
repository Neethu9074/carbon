/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import AlertConfigTearSheetStep3 from 'in-alerting/smart-alerts/synthetics/tearsheet/steps/AlertConfigTearSheetStep3';
import alertFormDefinition from 'in-alerting/smart-alerts/synthetics/form/alertDialogFormDefinition';
import { initialConfig } from 'in-alerting/smart-alerts/synthetics/data/alertConfig.json';
import { t } from 'in-i18n';

describe('AlertConfigTearSheetStep3 : in-alerting/smart-alerts/infrastructure/tearsheet/steps/AlertConfigTearSheetStep3', () => {
  const updateForm = jest.fn();
  const onChange = jest.fn();
  const form = alertFormDefinition(initialConfig);

  it('should render step 3 components: Alert property section', async () => {
    await render(<AlertConfigTearSheetStep3 form={form} onChange={onChange} updateForm={updateForm} />);
    const textInputs = screen.getAllByRole('textbox');
    expect(textInputs.length).toBe(2);
    expect(screen.getByText(t('in-alerting:smartAlerts.synthetics.tearSheet.step3.header'))).toBeInTheDocument();
    expect(
      screen.getByText(t('in-alerting:smartAlerts.applications.tearSheet.alertProperties.previewTitle'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertyInsertPlaceholderLabel'))
    ).toBeInTheDocument();
  });

  it('should render step 3 components: Custom payload section', async () => {
    render(<AlertConfigTearSheetStep3 form={form} onChange={onChange} updateForm={updateForm} />);

    const addRowBtn = screen.getByRole('button', {
      name: t('in-alerting:components.customPayload.addRow')
    });
    expect(addRowBtn).toBeTruthy();
    fireEvent.click(addRowBtn);
    expect(
      screen.getByText(t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.payloadsOptional.title'))
    ).toBeInTheDocument();
  });
});
