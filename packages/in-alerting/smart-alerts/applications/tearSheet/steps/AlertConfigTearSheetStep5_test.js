/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import AlertConfigTearSheetStep5 from 'in-alerting/smart-alerts/applications/tearSheet/steps/AlertConfigTearSheetStep5';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { alertConfig } from 'in-alerting/smart-alerts/applications/data/alertConfigData.json';
import { t } from 'in-i18n';

describe('AlertConfigTearSheetStep5 : in-alerting/smart-alerts/applications/tearSheet/steps/AlertConfigTearSheetStep5', () => {
  const onChange = jest.fn();
  const updateForm = jest.fn();
  const form = createSmartAlertForm(alertConfig, true, true);
  it('should render correctly - Alert Properties', async () => {
    render(<AlertConfigTearSheetStep5 form={form} updateForm={updateForm} onChange={onChange} applicationLabel />);
    expect(
      screen.getByText(t('in-alerting:smartAlerts.applications.tearSheet.AlertPropertiesTitle'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-alerting:smartAlerts.applications.tearSheet.alertProperties.previewTitle'))
    ).toBeInTheDocument();
  });

  it('should render Custom payload section', async () => {
    render(<AlertConfigTearSheetStep5 form={form} updateForm={updateForm} onChange={onChange} applicationLabel />);
    expect(
      screen.getByText(t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.payloadsOptional.title'))
    ).toBeInTheDocument();
  });
});
