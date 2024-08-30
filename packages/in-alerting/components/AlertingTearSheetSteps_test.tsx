/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { alertConfig } from 'in-alerting/smart-alerts/applications/data/alertConfigData.json';
import AlertingTearSheetSteps from 'in-alerting/components/AlertingTearSheetSteps';
import { t } from 'in-i18n';

describe('in-alerting/components/AlertingTearSheetSteps', () => {
  it('renders component correctly', () => {
    const props = {
      stepConfigs: [
        { title: 'step 1', valid: true, validateIntermediately: [] },
        { title: 'step 2', valid: true, validateIntermediately: [], isOptional: true }
      ],
      step: 1,
      setStep: jest.fn(),
      form: createSmartAlertForm(alertConfig as any, true, true),
      sideNavigationEnabled: true
    };
    render(<AlertingTearSheetSteps {...props} />);
    // test step 1
    expect(screen.getByText('1.')).toBeInTheDocument();
    expect(screen.getByText('step 1')).toBeInTheDocument();

    // test step 2
    expect(screen.getByText('2.')).toBeInTheDocument();
    expect(screen.getByText('step 2')).toBeInTheDocument();
    // test optional step
    expect(screen.getByText(t('in-alerting:components.optional'))).toBeInTheDocument();
    // test step navigation
    fireEvent.click(screen.getByText('step 2'));
    expect(props.setStep).toHaveBeenCalled();
  });
});
