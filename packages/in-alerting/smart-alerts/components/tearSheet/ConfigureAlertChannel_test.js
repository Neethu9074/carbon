/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/tearSheet/ConfigureAlertChannel';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { alertConfig } from 'in-alerting/smart-alerts/applications/data/alertConfigData.json';
import { t } from 'in-i18n';

describe('ConfigureAlertChannel : in-alerting/smart-alerts/components/tearSheet/ConfigureAlertChannel', () => {
  const onChange = jest.fn();
  const form = createSmartAlertForm(alertConfig, true, true);
  const channelCount = alertConfig.alertChannelIds.length;
  const user = userEvent.setup();
  it('should render correctly', async () => {
    render(<ConfigureAlertChannel form={form} onChange={onChange} />);
    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.smartAlertDialog.createAlertChannelTitle'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-alerting:smartAlerts.applications.tearSheet.alertChannelList.title', { channelCount }))
    ).toBeInTheDocument();
  });

  it('should render component and click the button', async () => {
    render(<ConfigureAlertChannel form={form} onChange={onChange} />);
    const createBtn = screen.getByText(
      t('in-alerting:smartAlerts.components.smartAlertDialog.createAlertChannelTitle')
    );
    expect(createBtn).toBeInTheDocument();
    user.click(createBtn);
    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.smartAlertDialog.createAlertChannelTitle'))
    ).toBeInTheDocument();
  });
});
