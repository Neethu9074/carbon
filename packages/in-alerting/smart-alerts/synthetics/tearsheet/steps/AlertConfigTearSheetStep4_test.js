/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import AlertConfigTearSheetStep4 from 'in-alerting/smart-alerts/synthetics/tearsheet/steps/AlertConfigTearSheetStep4';
import alertFormDefinition from 'in-alerting/smart-alerts/synthetics/form/alertDialogFormDefinition';
import { initialConfig } from 'in-alerting/smart-alerts/synthetics/data/alertConfig.json';
import { t } from 'in-i18n';

describe('AlertConfigTearSheetStep4 : in-alerting/smart-alerts/infrastructure/tearsheet/steps/AlertConfigTearSheetStep4', () => {
  const onChange = jest.fn();
  const form = alertFormDefinition(initialConfig);

  it('should render Alert channel section', async () => {
    render(<AlertConfigTearSheetStep4 form={form} onChange={onChange} />);
    expect(screen.getByText(t('in-alerting:smartAlerts.synthetics.tearSheet.step4.header'))).toBeInTheDocument();
    const createBtn = screen.getByRole('button', {
      name: t('in-alerting:smartAlerts.components.smartAlertDialog.createAlertChannelTitle')
    });
    expect(createBtn).toBeTruthy();
  });
});
