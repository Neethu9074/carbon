/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import AlertConfigTearSheetStep2 from 'in-alerting/smart-alerts/synthetics/tearsheet/steps/AlertConfigTearSheetStep2';
import alertFormDefinition from 'in-alerting/smart-alerts/synthetics/form/alertDialogFormDefinition';
import { initialConfig } from 'in-alerting/smart-alerts/synthetics/data/alertConfig.json';
import { t } from 'in-i18n';

describe('AlertConfigTearSheetStep2 : in-alerting/smart-alerts/infrastructure/tearsheet/steps/AlertConfigTearSheetStep2', () => {
  const updateForm = jest.fn();
  const form = alertFormDefinition(initialConfig);

  it('should render step 1 components', async () => {
    render(<AlertConfigTearSheetStep2 form={form} updateForm={updateForm} />);
    expect(screen.getByText(t('in-alerting:smartAlerts.synthetics.tearSheet.step2.sliderHeader'))).toBeInTheDocument();
    expect(
      screen.getByText(t('in-alerting:smartAlerts.synthetics.tearSheet.step2.sliderDescription'))
    ).toBeInTheDocument();
    expect(screen.getByText(t('in-alerting:smartAlerts.components.gracePeriod.title'))).toBeInTheDocument();
    expect(screen.getByText(t('in-alerting:smartAlerts.components.gracePeriod.description'))).toBeInTheDocument();
  });
});
