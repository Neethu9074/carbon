/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

//@ts-expect-error
import { alertConfig } from 'in-alerting/smart-alerts/infrastructure/data/testData';
import ForecastAlerting from 'in-alerting/smart-alerts/infrastructure/components/ForecastAlerting';
import alertFormDefinition from 'in-alerting/smart-alerts/infrastructure/form/alertFormDefinition';
import { t } from 'in-i18n';

describe('Render ForecastAlerting : in-alerting/smart-alerts/infrastructure/components/ForecastAlerting', () => {
  const form = alertFormDefinition(alertConfig, false);
  const updateForm = jest.fn();
  it('Check if component rendered in UI', () => {
    render(<ForecastAlerting form={form} updateForm={updateForm} />);
    expect(
      screen.getByText(t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.predictiveTrigger.title'))
    ).toBeInTheDocument();
    expect(screen.getByText('up to 1 hour')).toBeInTheDocument();
    expect(screen.getByText('last 1 day')).toBeInTheDocument();
  });
});
