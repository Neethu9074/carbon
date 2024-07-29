/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import ConfigureTraceImpact from 'in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/ConfigureTraceImpact';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { alertConfig } from 'in-alerting/smart-alerts/applications/data/alertConfigData.json';
import { t } from 'in-i18n';

describe('ConfigureTraceImpact : in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/ConfigureTraceImpact', () => {
  const form = createSmartAlertForm(alertConfig, true, true);
  const user = userEvent.setup();
  const onChange = jest.fn();
  it('should render correctly', async () => {
    render(<ConfigureTraceImpact form={form} onChange={onChange} />);
    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.triggerAfter'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.tracesImpacted'))
    ).toBeInTheDocument();

    const timeThresholdField = screen.getByRole('spinbutton');
    await user.type(timeThresholdField, '5');
    expect(onChange).toHaveBeenCalled();
    fireEvent.change(timeThresholdField, { target: { value: '7' } });
    expect(onChange).toHaveBeenCalled();
  });
});
