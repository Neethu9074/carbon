/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import InfraMultiThresholdCondition from 'in-alerting/smart-alerts/infrastructure/components/InfraMultiThresholdCondition';
//@ts-expect-error
import { alertConfig } from 'in-alerting/smart-alerts/infrastructure/data/testData';
import alertFormDefinition from 'in-alerting/smart-alerts/infrastructure/form/alertFormDefinition';
import { t } from 'in-i18n';

describe('Render InfraMultiThresholdCondition : in-alerting/smart-alerts/infrastructure/components/InfraMultiThresholdCondition', () => {
  const form = alertFormDefinition(alertConfig, false);
  const updateForm = jest.fn();

  it('Check if component rendered in UI', () => {
    render(<InfraMultiThresholdCondition form={form} updateForm={updateForm} percentageMetric metricUnitPostfix="%" />);

    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.smartAlertDialog.labelThreshold'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionStaticThreshold'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.smartAlertDialog.warningThresholdLabel'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.smartAlertDialog.criticalThresholdLabel'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.smartAlertDialog.multiThresholdAlertNotificationInfo'))
    ).toBeInTheDocument();
  });
});
