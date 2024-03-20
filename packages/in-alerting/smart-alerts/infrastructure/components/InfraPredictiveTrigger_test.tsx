/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import InfraPredictiveTrigger, {
  getTimeToFailure
} from 'in-alerting/smart-alerts/infrastructure/components/InfraPredictiveTrigger';
//@ts-expect-error
import { alertConfig } from 'in-alerting/smart-alerts/infrastructure/data/testData';
import alertFormDefinition from 'in-alerting/smart-alerts/infrastructure/form/alertFormDefinition';
import { t } from 'in-i18n';

describe('Render InfraPredictiveTrigger : in-alerting/smart-alerts/infrastructure/components/InfraPredictiveTrigger', () => {
  const form = alertFormDefinition(alertConfig, false);
  const updateForm = jest.fn();
  it('Check if component rendered in UI', () => {
    render(<InfraPredictiveTrigger form={form} updateForm={updateForm} />);
    expect(
      screen.getByText(
        t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.predictiveTrigger.alertTitle', {
          value: '30 minutes'
        })
      )
    ).toBeInTheDocument();
    expect(screen.getByText('30 minutes')).toBeInTheDocument();
  });

  it('returns null when minutes is undefined', () => {
    const result = getTimeToFailure(null);

    expect(result).toBeNull();
  });

  it('returns the correct string when minutes is defined', () => {
    const result = getTimeToFailure(60000);

    expect(result).toEqual(
      t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.predictiveTrigger.alertTitle', {
        value: '1 minute'
      })
    );
  });
});
