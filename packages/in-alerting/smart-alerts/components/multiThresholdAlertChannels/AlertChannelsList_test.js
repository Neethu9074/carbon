/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import AlertChannelsList from 'in-alerting/smart-alerts/components/multiThresholdAlertChannels/AlertChannelsList';
import { alertConfigMultiThreshold } from 'in-alerting/smart-alerts/applications/data/alertConfigData.json';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { t } from 'in-i18n';

// Ignoring the testcase as it doesnt test the actual functionality but
// just the component render. This is already covered in e2e tests.
xdescribe('AlertChannelsList : in-alerting/smart-alerts/components/multiThresholdAlertChannels/ConfigureAlertChannel', () => {
  const onChange = jest.fn();
  const form = createSmartAlertForm(alertConfigMultiThreshold, true, true, true);
  it('should render correctly', async () => {
    render(<AlertChannelsList form={form} onChange={onChange} />);
    expect(screen.getByText(t('in-settings:tabs.alertChannels'))).toBeInTheDocument();
    expect(screen.getByText(t('in-alerting:smartAlerts.alertChannelList.warning'))).toBeInTheDocument();
    expect(screen.getByText(t('in-alerting:smartAlerts.alertChannelList.critical'))).toBeInTheDocument();
  });
});
