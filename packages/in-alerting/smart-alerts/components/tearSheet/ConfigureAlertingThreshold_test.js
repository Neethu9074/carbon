/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import ConfigureAlertingThreshold from 'in-alerting/smart-alerts/components/tearSheet/ConfigureAlertingThreshold';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { alertConfig } from 'in-alerting/smart-alerts/applications/data/alertConfigData.json';
import { t } from 'in-i18n';

describe('ConfigureAlertingThreshold : in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/ConfigureTimeWindow', () => {
  const onChange = jest.fn();
  const form = createSmartAlertForm(alertConfig, true, true);
  const user = userEvent.setup();
  const updateForm = jest.fn();
  it('should render correctly', async () => {
    render(<ConfigureAlertingThreshold form={form} onChange={onChange} updateForm={updateForm} />);
    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.tracesImpacted'))
    ).toBeInTheDocument();
  });

  it('should render correctly with violationsInSequence selected', async () => {
    alertConfig.timeThreshold = {
      type: 'violationsInSequence',
      timeWindow: 1200000
    };
    const formWithviolationsInSequence = createSmartAlertForm(alertConfig, true, true);
    render(
      <ConfigureAlertingThreshold form={formWithviolationsInSequence} onChange={onChange} updateForm={updateForm} />
    );
    expect(
      screen.getByText(
        t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.numberOfConsecutiveViolationsPostLabel', {
          granularity: 20
        })
      )
    ).toBeInTheDocument();
  });

  it('should allow user to change the tracer impact value and onchange should trigger', async () => {
    render(<ConfigureAlertingThreshold form={form} onChange={onChange} updateForm={updateForm} />);

    const timeThresholdField = screen.getByRole('spinbutton');
    await user.type(timeThresholdField, '5');
    expect(onChange).toHaveBeenCalled();
    fireEvent.change(timeThresholdField, { target: { value: '7' } });
    expect(onChange).toHaveBeenCalled();
  });
});
