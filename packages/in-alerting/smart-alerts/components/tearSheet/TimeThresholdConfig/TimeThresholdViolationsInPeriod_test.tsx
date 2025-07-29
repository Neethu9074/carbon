/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { MapForm, Field } from 'formalistic';
import React from 'react';

import TimeThresholdViolationsInPeriod from 'in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/TimeThresholdViolationsInPeriod';

// Mock dependencies
jest.mock('in-i18n', () => ({
  t: jest.fn((key, params) => {
    if (params && params.granularity) {
      return `${key} ${params.granularity}`;
    }
    return key;
  })
}));

jest.mock('in-components/form/TouchedMessages/TouchedMessages', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="touched-messages" />)
}));

jest.mock(
  'in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/TimeThresholdViolationsInSequence',
  () => ({
    __esModule: true,
    default: jest.fn(props => (
      <div data-testid="time-threshold-violations-in-sequence">
        <span>{props.label}</span>
      </div>
    ))
  })
);

jest.mock('in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/ConfigureGranularity', () => ({
  getMarksForThresholdType: jest.fn(() => [
    { value: 5, label: '5 min', millis: 300000 },
    { value: 10, label: '10 min', millis: 600000 },
    { value: 15, label: '15 min', millis: 900000 }
  ]),
  getDefaultMark: jest.fn(() => ({ value: 10, label: '10 min', millis: 600000 }))
}));

describe('TimeThresholdViolationsInPeriod : in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/TimeThresholdViolationsInPeriod', () => {
  const updateForm = jest.fn();

  // Helper function to create a mock form
  const createMockForm = (timeWindowValue = 1800000, violationsValue = 3) => {
    // Default 30 minutes, 3 violations
    const timeWindowField = {
      value: timeWindowValue,
      touched: false,
      setValue: jest.fn().mockImplementation(function (this: any, value: number) {
        this.value = value;
        return this;
      }),
      setTouched: jest.fn().mockImplementation(function (this: any, touched: boolean) {
        this.touched = touched;
        return this;
      })
    } as unknown as Field<number>;

    const violationsField = {
      value: violationsValue,
      touched: false,
      setValue: jest.fn().mockImplementation(function (this: any, value: number) {
        this.value = value;
        return this;
      }),
      setTouched: jest.fn().mockImplementation(function (this: any, touched: boolean) {
        this.touched = touched;
        return this;
      })
    } as unknown as Field<number>;

    return {
      get: jest.fn().mockImplementation(key => {
        if (key === 'timeThreshold') {
          return {
            get: jest.fn().mockImplementation(nestedKey => {
              if (nestedKey === 'timeWindow') {
                return timeWindowField;
              } else if (nestedKey === 'violations') {
                return violationsField;
              }
              return null;
            }),
            updateIn: jest.fn().mockImplementation((path, updaterFn) => {
              // Correctly handle the updateIn method by calling the updater function with the field
              if (path[0] === 'violations') {
                updaterFn(violationsField);
              }
              return {
                /* updated form */
              };
            }),
            toJS: jest.fn().mockReturnValue({})
          };
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
      }),
      put: jest.fn().mockReturnThis()
    } as unknown as MapForm<any>;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with default props', () => {
    const mockForm = createMockForm();

    render(<TimeThresholdViolationsInPeriod form={mockForm} updateForm={updateForm} />);

    // Check if the label is rendered
    expect(
      screen.getByText('in-alerting:smartAlerts.components.tearSheet.timeThreshold.violationsOccurrenceLabel')
    ).toBeInTheDocument();

    // Check if the input is rendered with the correct value
    const input = screen.getByTestId('violationCountInput');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('value', '3'); // Default violations value
    expect(input).toHaveAttribute('min', '1');
    expect(input).toHaveAttribute('max', '3'); // maxViolations = timeWindow / granularity = 1800000 / 600000 = 3
    expect(input).toHaveAttribute('type', 'number');

    // Check if the "violations across" text is rendered
    expect(
      screen.getByText('in-alerting:smartAlerts.components.tearSheet.timeThreshold.violationAcross')
    ).toBeInTheDocument();

    // Check if the TimeThresholdViolationsInSequence component is rendered with the correct label
    expect(screen.getByTestId('time-threshold-violations-in-sequence')).toBeInTheDocument();
    expect(
      screen.getByText('in-alerting:smartAlerts.components.tearSheet.timeThreshold.bucketsOfTime 10')
    ).toBeInTheDocument();
  });

  it('should call updateForm when input value changes', async () => {
    const mockForm = createMockForm();

    render(<TimeThresholdViolationsInPeriod form={mockForm} updateForm={updateForm} />);

    const input = screen.getByTestId('violationCountInput');

    // Change the input value
    fireEvent.change(input, { target: { value: '2' } });

    // Wait for the debounce
    await new Promise(resolve => setTimeout(resolve, 300));

    // Check if updateForm was called
    expect(updateForm).toHaveBeenCalled();
  });

  it('should update the form with the new violations value', async () => {
    const mockForm = createMockForm();
    const timeThresholdForm = mockForm.get('timeThreshold');
    const violationsField = timeThresholdForm.get('violations');

    render(<TimeThresholdViolationsInPeriod form={mockForm} updateForm={updateForm} />);

    const input = screen.getByTestId('violationCountInput');

    // Change the input value to 2
    fireEvent.change(input, { target: { value: '2' } });

    // Wait for the debounce
    await new Promise(resolve => setTimeout(resolve, 300));

    // Check if the field was updated correctly
    expect(violationsField.setValue).toHaveBeenCalledWith('2');
    expect(violationsField.setTouched).toHaveBeenCalledWith(true);

    // Check if updateForm was called with the updated form
    expect(mockForm.put).toHaveBeenCalledWith('timeThreshold', expect.anything());
    expect(updateForm).toHaveBeenCalledWith(mockForm);
  });

  it('should cap the input value at maxViolations', async () => {
    const mockForm = createMockForm();
    const timeThresholdForm = mockForm.get('timeThreshold');
    const violationsField = timeThresholdForm.get('violations');

    render(<TimeThresholdViolationsInPeriod form={mockForm} updateForm={updateForm} />);

    const input = screen.getByTestId('violationCountInput');

    // Change the input value to a value greater than maxViolations (3)
    fireEvent.change(input, { target: { value: '5' } });

    // Wait for the debounce
    await new Promise(resolve => setTimeout(resolve, 300));

    // Check if the field was updated with the capped value
    expect(violationsField.setValue).toHaveBeenCalledWith(3);
  });

  it('should render TouchedMessages component with the correct field', () => {
    const mockForm = createMockForm();

    render(<TimeThresholdViolationsInPeriod form={mockForm} updateForm={updateForm} />);

    // Check if TouchedMessages is rendered
    expect(screen.getByTestId('touched-messages')).toBeInTheDocument();
  });
});

// Made with Bob
