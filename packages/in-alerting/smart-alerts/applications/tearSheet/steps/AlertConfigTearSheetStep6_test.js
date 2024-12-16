/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import AlertConfigTearSheetStep6 from 'in-alerting/smart-alerts/applications/tearSheet/steps/AlertConfigTearSheetStep6';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { alertConfig } from 'in-alerting/smart-alerts/applications/data/alertConfigData.json';
import { t } from 'in-i18n';

describe('AlertConfigTearSheetStep6 : in-alerting/smart-alerts/applications/tearSheet/steps/AlertConfigTearSheetStep6', () => {
  const onChange = jest.fn();
  const updateForm = jest.fn();
  const form = createSmartAlertForm(alertConfig, true, true);

  it('should render Alert channel section', async () => {
    render(<AlertConfigTearSheetStep6 form={form} updateForm={updateForm} onChange={onChange} applicationLabel />);
    expect(screen.getByText(t('in-alerting:smartAlerts.applications.tearSheet.AlertChannelTitle'))).toBeInTheDocument();
    expect(
      screen.getByText(t('in-alerting:smartAlerts.applications.tearSheet.alertChannelList.description'))
    ).toBeInTheDocument();
  });
});
