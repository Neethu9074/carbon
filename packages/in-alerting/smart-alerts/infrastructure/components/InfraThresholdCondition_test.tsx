/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import InfraThresholdCondition from 'in-alerting/smart-alerts/infrastructure/components/InfraThresholdCondition';
//@ts-expect-error
import { alertConfig } from 'in-alerting/smart-alerts/infrastructure/data/testData';
import alertFormDefinition from 'in-alerting/smart-alerts/infrastructure/form/alertFormDefinition';
import { t } from 'in-i18n';

describe('Render InfraThresholdCondition : in-alerting/smart-alerts/infrastructure/components/InfraThresholdCondition', () => {
  const form = alertFormDefinition(alertConfig, false);
  const updateForm = jest.fn();
  it('Check if component rendered in UI', () => {
    render(<InfraThresholdCondition form={form} updateForm={updateForm} percentageMetric metricUnitPostfix="%" />);
    expect(
      screen.getByText(t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.thresholdValue'))
    ).toBeInTheDocument();
  });

  it('Check if threshold operator and threshold value rendered correctly in UI', () => {
    render(<InfraThresholdCondition form={form} updateForm={updateForm} percentageMetric metricUnitPostfix="%" />);
    expect(screen.getByText('>')).toBeInTheDocument();
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '23' } });
    //@ts-expect-error
    expect(input.value).toBe('23');
  });
});
