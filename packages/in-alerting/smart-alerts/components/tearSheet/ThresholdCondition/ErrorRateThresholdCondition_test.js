/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import ErrorRateThresholdCondition from 'in-alerting/smart-alerts/components/tearSheet/ThresholdCondition/ErrorRateThresholdCondition';
import { blueprintConfig } from 'in-alerting/smart-alerts/components/tearSheet/ThresholdCondition/SlownessThresholdCondition_test';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { alertConfig } from 'in-alerting/smart-alerts/applications/data/alertConfigData.json';
import { t } from 'in-i18n';

describe('ErrorRateThresholdCondition', () => {
  let props;
  beforeEach(() => {
    props = {
      form: createSmartAlertForm(alertConfig, true, true),
      updateForm: jest.fn(),
      blueprintConfig: blueprintConfig,
      editMode: false,
      isGlobalSmartAlert: false
    };
  });
  it('renders correctly when the threshold type is Static', () => {
    render(<ErrorRateThresholdCondition {...props} />);
    expect(
      screen.getByText(t('in-alerting:smartAlerts.applications.tearSheet.threshold.thresholdValue'))
    ).toBeInTheDocument();
  });
});
