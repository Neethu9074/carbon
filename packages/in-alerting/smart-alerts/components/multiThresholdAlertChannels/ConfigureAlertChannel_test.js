/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/multiThresholdAlertChannels/ConfigureAlertChannel';
import { alertConfigMultiThreshold } from 'in-alerting/smart-alerts/applications/data/alertConfigData.json';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { t } from 'in-i18n';

describe('ConfigureAlertChannel : in-alerting/smart-alerts/components/multiThresholdAlertChannels/ConfigureAlertChannel', () => {
  const onChange = jest.fn();
  const setCustomSlideInHeaderConfig = jest.fn();
  const form = createSmartAlertForm(alertConfigMultiThreshold, true, true, true);
  const user = userEvent.setup();
  it('should render correctly', async () => {
    render(
      <ConfigureAlertChannel
        form={form}
        onChange={onChange}
        setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
      />
    );
    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.smartAlertDialog.selectAlertChannelButtonTitle'))
    ).toBeInTheDocument();
    expect(screen.getByText(t('in-settings:tabs.alertChannels'))).toBeInTheDocument();
  });

  it('should render component and click the button', async () => {
    render(
      <ConfigureAlertChannel
        form={form}
        onChange={onChange}
        setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
      />
    );
    const selectChannelBtn = screen.getByText(
      t('in-alerting:smartAlerts.components.smartAlertDialog.selectAlertChannelButtonTitle')
    );
    expect(selectChannelBtn).toBeInTheDocument();
    user.click(selectChannelBtn);
    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.smartAlertDialog.selectAlertChannelButtonTitle'))
    ).toBeInTheDocument();
  });
});
