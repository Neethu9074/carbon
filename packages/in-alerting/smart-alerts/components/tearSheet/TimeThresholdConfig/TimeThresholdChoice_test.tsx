/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { MapForm } from 'formalistic';
import React from 'react';

import {
  timeThresholdTypesTearSheet,
  TimeThresholdTypeTearSheet
} from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/formData';
import TimeThresholdChoice from 'in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/TimeThresholdChoice';

// Mock the imported functions
jest.mock('in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/SelectTimeThreshold', () => ({
  getTimeThresholdFormForType: jest.fn(type => ({ type: { value: type } }))
}));

jest.mock('in-i18n', () => ({
  t: jest.fn(key => key)
}));

describe('TimeThresholdChoice : in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/TimeThresholdChoice', () => {
  const { violationsInSequence, violationsInPeriod, traceImpact, userImpactOfViolationsInSequence } =
    timeThresholdTypesTearSheet;

  const mockUpdateForm = jest.fn();

  const createMockForm = (timeThresholdType: TimeThresholdTypeTearSheet) => {
    return {
      get: jest.fn().mockImplementation(key => {
        if (key === 'timeThreshold') {
          return {
            get: jest.fn().mockImplementation(nestedKey => {
              if (nestedKey === 'type') {
                return { value: timeThresholdType };
              }
              return { value: null };
            })
          };
        }
        return { value: null };
      }),
      put: jest.fn().mockReturnThis()
    } as unknown as MapForm<any>;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with default options', () => {
    const mockForm = createMockForm(violationsInSequence);

    render(
      <TimeThresholdChoice
        form={mockForm}
        updateForm={mockUpdateForm}
        hasTraceImpactOption={false}
        hasUserImpactOption={false}
        impactTimeThresholdDisabled={false}
      />
    );

    // Check if the radio button group is rendered with the correct legend text
    expect(
      screen.getByText('in-alerting:smartAlerts.components.tearSheet.timeThreshold.triggerAlert')
    ).toBeInTheDocument();

    // Check if the basic options are rendered
    expect(
      screen.getByText('in-alerting:smartAlerts.components.tearSheet.timeThreshold.violationsInSequenceLabel')
    ).toBeInTheDocument();
    expect(
      screen.getByText('in-alerting:smartAlerts.components.tearSheet.timeThreshold.violationsInPeriodLabel')
    ).toBeInTheDocument();

    // Check that the impact options are not rendered
    expect(
      screen.queryByText(
        'in-alerting:smartAlerts.components.tearSheet.timeThreshold.timeThresholdConfigTimeThresholdLabelTraceImpact'
      )
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'in-alerting:smartAlerts.components.tearSheet.timeThreshold.labelUserImpactOfViolationsInSequence'
      )
    ).not.toBeInTheDocument();
  });

  it('should render with trace impact option when enabled', () => {
    const mockForm = createMockForm(traceImpact);

    render(
      <TimeThresholdChoice
        form={mockForm}
        updateForm={mockUpdateForm}
        hasTraceImpactOption
        hasUserImpactOption={false}
        impactTimeThresholdDisabled={false}
      />
    );

    // Check if the trace impact option is rendered
    expect(
      screen.getByText(
        'in-alerting:smartAlerts.components.tearSheet.timeThreshold.timeThresholdConfigTimeThresholdLabelTraceImpact'
      )
    ).toBeInTheDocument();
  });

  it('should render with user impact option when enabled', () => {
    const mockForm = createMockForm(userImpactOfViolationsInSequence);

    render(
      <TimeThresholdChoice
        form={mockForm}
        updateForm={mockUpdateForm}
        hasTraceImpactOption={false}
        hasUserImpactOption
        impactTimeThresholdDisabled={false}
      />
    );

    // Check if the user impact option is rendered
    expect(
      screen.getByText(
        'in-alerting:smartAlerts.components.tearSheet.timeThreshold.labelUserImpactOfViolationsInSequence'
      )
    ).toBeInTheDocument();
  });

  it('should not render impact options when impactTimeThresholdDisabled is true', () => {
    const mockForm = createMockForm(violationsInSequence);

    render(
      <TimeThresholdChoice
        form={mockForm}
        updateForm={mockUpdateForm}
        hasTraceImpactOption
        hasUserImpactOption
        impactTimeThresholdDisabled
      />
    );

    // Check that the impact options are not rendered
    expect(
      screen.queryByText(
        'in-alerting:smartAlerts.components.tearSheet.timeThreshold.timeThresholdConfigTimeThresholdLabelTraceImpact'
      )
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'in-alerting:smartAlerts.components.tearSheet.timeThreshold.labelUserImpactOfViolationsInSequence'
      )
    ).not.toBeInTheDocument();
  });

  it('should call updateForm when a radio button is selected', () => {
    const mockForm = createMockForm(violationsInPeriod);
    const {
      getTimeThresholdFormForType
    } = require('in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/SelectTimeThreshold');

    render(
      <TimeThresholdChoice
        form={mockForm}
        updateForm={mockUpdateForm}
        hasTraceImpactOption={false}
        hasUserImpactOption={false}
        impactTimeThresholdDisabled={false}
      />
    );

    // Simulate selecting the violations in sequence option
    fireEvent.click(
      screen.getByLabelText('in-alerting:smartAlerts.components.tearSheet.timeThreshold.violationsInSequenceLabel')
    );

    // Check if updateForm was called with the correct arguments
    expect(getTimeThresholdFormForType).toHaveBeenCalledWith(mockForm, violationsInSequence);
    expect(mockUpdateForm).toHaveBeenCalled();
  });

  it('should select the correct option based on form value', () => {
    // Create a form with violationsInSequence selected
    const mockForm = createMockForm(violationsInSequence);

    const { container } = render(
      <TimeThresholdChoice
        form={mockForm}
        updateForm={mockUpdateForm}
        hasTraceImpactOption={false}
        hasUserImpactOption={false}
        impactTimeThresholdDisabled={false}
      />
    );

    // Find the selected radio button
    const selectedRadio = container.querySelector('input[checked]');
    expect(selectedRadio).toHaveAttribute('id', violationsInSequence);
  });
});

// Made with Bob
