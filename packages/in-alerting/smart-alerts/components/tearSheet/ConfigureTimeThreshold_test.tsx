/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import { MapForm } from 'formalistic';
import React from 'react';

import {
  timeThresholdTypesTearSheet,
  TimeThresholdTypeTearSheet
} from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/formData';
import ConfigureTimeThreshold from 'in-alerting/smart-alerts/components/tearSheet/ConfigureTimeThreshold';

// Mock dependencies
jest.mock('in-i18n', () => ({
  t: jest.fn((key, params) => {
    if (params && params.granularity) {
      return `${key} ${params.granularity}`;
    }
    return key;
  })
}));

jest.mock('in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/ConfigureGranularity', () => ({
  getMarksForThresholdType: jest.fn(() => [
    { value: 5, label: '5 min', millis: 300000 },
    { value: 10, label: '10 min', millis: 600000 },
    { value: 15, label: '15 min', millis: 900000 }
  ]),
  getDefaultMark: jest.fn(() => ({ value: 10, label: '10 min', millis: 600000 }))
}));

// Mock child components
jest.mock('./TimeThresholdConfig/TimeThresholdViolationsInSequence', () => ({
  __esModule: true,
  default: jest.fn(props => (
    <div data-testid="time-threshold-violations-in-sequence">
      <span>{props.label}</span>
    </div>
  ))
}));

jest.mock('./TimeThresholdConfig/TimeThresholdViolationsInPeriod', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="time-threshold-violations-in-period">TimeThresholdViolationsInPeriod</div>)
}));

jest.mock('./TimeThresholdConfig/TraceImpact', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="trace-impact">TraceImpact</div>)
}));

jest.mock('./TimeThresholdConfig/ConfigureUserImpact', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="configure-user-impact">ConfigureUserImpact</div>)
}));

describe('ConfigureTimeThreshold : in-alerting/smart-alerts/components/tearSheet/ConfigureTimeThreshold', () => {
  const onChange = jest.fn();
  const updateForm = jest.fn();

  // Helper function to create a mock form with different timeThresholdType values
  const createMockForm = (
    timeThresholdType: TimeThresholdTypeTearSheet = timeThresholdTypesTearSheet.violationsInSequence
  ) => {
    const timeThresholdField = {
      get: jest.fn().mockImplementation(key => {
        if (key === 'type') {
          return { value: timeThresholdType };
        }
        return null;
      })
    };

    return {
      get: jest.fn().mockImplementation(key => {
        if (key === 'timeThreshold') {
          return timeThresholdField;
        } else if (key === 'granularity') {
          return { value: 600000 }; // 10 minutes in milliseconds
        } else if (key === 'threshold') {
          return {
            get: jest.fn().mockImplementation(nestedKey => {
              if (nestedKey === 'warningThreshold') {
                return {
                  get: jest.fn().mockImplementation(deepNestedKey => {
                    if (deepNestedKey === 'type') {
                      return { value: 'static' };
                    }
                    return null;
                  })
                };
              }
              return null;
            })
          };
        }
        return null;
      })
    } as unknown as MapForm<any>;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render TimeThresholdViolationsInSequence when timeThresholdType is violationsInSequence', () => {
    const mockForm = createMockForm(timeThresholdTypesTearSheet.violationsInSequence);

    render(<ConfigureTimeThreshold form={mockForm} onChange={onChange} updateForm={updateForm} />);

    // Check if TimeThresholdViolationsInSequence is rendered
    expect(screen.getByTestId('time-threshold-violations-in-sequence')).toBeInTheDocument();

    // Check if the label is passed correctly with granularity
    expect(
      screen.getByText(
        'in-alerting:smartAlerts.components.tearSheet.timeThreshold.numberOfConsecutiveViolationsLabel 10'
      )
    ).toBeInTheDocument();

    // Check that other components are not rendered
    expect(screen.queryByTestId('time-threshold-violations-in-period')).toBeNull();
    expect(screen.queryByTestId('trace-impact')).toBeNull();
    expect(screen.queryByTestId('configure-user-impact')).toBeNull();
  });

  it('should render TimeThresholdViolationsInPeriod when timeThresholdType is violationsInPeriod', () => {
    const mockForm = createMockForm(timeThresholdTypesTearSheet.violationsInPeriod);

    render(<ConfigureTimeThreshold form={mockForm} onChange={onChange} updateForm={updateForm} />);

    // Check if TimeThresholdViolationsInPeriod is rendered
    expect(screen.getByTestId('time-threshold-violations-in-period')).toBeInTheDocument();

    // Check that other components are not rendered
    expect(screen.queryByTestId('time-threshold-violations-in-sequence')).toBeNull();
    expect(screen.queryByTestId('trace-impact')).toBeNull();
    expect(screen.queryByTestId('configure-user-impact')).toBeNull();
  });

  it('should render TraceImpact when timeThresholdType is traceImpact (requestImpact)', () => {
    const mockForm = createMockForm(timeThresholdTypesTearSheet.traceImpact);

    render(<ConfigureTimeThreshold form={mockForm} onChange={onChange} updateForm={updateForm} />);

    // Check if TraceImpact is rendered
    expect(screen.getByTestId('trace-impact')).toBeInTheDocument();

    // Check that other components are not rendered
    expect(screen.queryByTestId('time-threshold-violations-in-sequence')).toBeNull();
    expect(screen.queryByTestId('time-threshold-violations-in-period')).toBeNull();
    expect(screen.queryByTestId('configure-user-impact')).toBeNull();
  });

  it('should render ConfigureUserImpact when timeThresholdType is userImpactOfViolationsInSequence', () => {
    const mockForm = createMockForm(timeThresholdTypesTearSheet.userImpactOfViolationsInSequence);

    render(<ConfigureTimeThreshold form={mockForm} onChange={onChange} updateForm={updateForm} />);

    // Check if ConfigureUserImpact is rendered
    expect(screen.getByTestId('configure-user-impact')).toBeInTheDocument();

    // Check that other components are not rendered
    expect(screen.queryByTestId('time-threshold-violations-in-sequence')).toBeNull();
    expect(screen.queryByTestId('time-threshold-violations-in-period')).toBeNull();
    expect(screen.queryByTestId('trace-impact')).toBeNull();
  });

  it('should render nothing when timeThresholdType is unknown', () => {
    const mockForm = createMockForm('unknown-type' as TimeThresholdTypeTearSheet);

    render(<ConfigureTimeThreshold form={mockForm} onChange={onChange} updateForm={updateForm} />);

    // Check that no components are rendered
    expect(screen.queryByTestId('time-threshold-violations-in-sequence')).toBeNull();
    expect(screen.queryByTestId('time-threshold-violations-in-period')).toBeNull();
    expect(screen.queryByTestId('trace-impact')).toBeNull();
    expect(screen.queryByTestId('configure-user-impact')).toBeNull();
  });

  it('should pass the correct props to child components', () => {
    const mockForm = createMockForm(timeThresholdTypesTearSheet.violationsInSequence);
    const TimeThresholdViolationsInSequence =
      require('./TimeThresholdConfig/TimeThresholdViolationsInSequence').default;

    render(<ConfigureTimeThreshold form={mockForm} onChange={onChange} updateForm={updateForm} />);

    // Check if TimeThresholdViolationsInSequence is called with the correct props
    expect(TimeThresholdViolationsInSequence).toHaveBeenCalledWith(
      expect.objectContaining({
        form: mockForm,
        updateForm: updateForm,
        label: expect.any(String),
        isCustomInputStyle: true
      }),
      expect.anything()
    );
  });
});

// Made with Bob
