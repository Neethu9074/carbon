/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { MapForm, Field } from 'formalistic';
import React from 'react';

import TimeThresholdViolationsInSequence from 'in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/TimeThresholdViolationsInSequence';

// Mock dependencies
jest.mock('in-components/form/TouchedMessages/TouchedMessages', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="touched-messages" />)
}));

describe('TimeThresholdViolationsInSequence : in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/TimeThresholdViolationsInSequence', () => {
  const updateForm = jest.fn();
  const testLabel = 'Test Label';
  const granularityValue = 60000; // 1 minute in milliseconds

  // Helper function to create a mock form
  const createMockForm = (timeWindowValue = 300000) => {
    // Default 5 minutes (5 * 60000)
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

    return {
      get: jest.fn().mockImplementation(key => {
        if (key === 'timeThreshold') {
          return {
            get: jest.fn().mockImplementation(nestedKey => {
              if (nestedKey === 'timeWindow') {
                return timeWindowField;
              }
              return null;
            }),
            updateIn: jest.fn().mockImplementation((path, updaterFn) => {
              // Correctly handle the updateIn method by calling the updater function with the field
              if (path[0] === 'timeWindow') {
                updaterFn(timeWindowField);
              }
              return {
                /* updated form */
              };
            }),
            toJS: jest.fn().mockReturnValue({})
          };
        } else if (key === 'granularity') {
          return { value: granularityValue };
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

    render(<TimeThresholdViolationsInSequence form={mockForm} updateForm={updateForm} label={testLabel} />);

    // Check if the label is rendered
    expect(screen.getByText(testLabel)).toBeInTheDocument();

    // Check if the input is rendered with the correct value
    // The displayed value should be timeWindow / granularity = 300000 / 60000 = 5
    const input = screen.getByTestId('timeWindowInput');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('value', '5');
    expect(input).toHaveAttribute('min', '1');
    expect(input).toHaveAttribute('max', '12'); // maxTimeWindow constant in the component
    expect(input).toHaveAttribute('type', 'number');
  });

  it('should call updateForm when input value changes', async () => {
    const mockForm = createMockForm();

    render(<TimeThresholdViolationsInSequence form={mockForm} updateForm={updateForm} label={testLabel} />);

    const input = screen.getByTestId('timeWindowInput');

    // Change the input value
    fireEvent.change(input, { target: { value: '10' } });

    // Wait for the debounce
    await new Promise(resolve => setTimeout(resolve, 300));

    // Check if updateForm was called
    expect(updateForm).toHaveBeenCalled();
  });

  it('should update the form with the new value multiplied by granularity', async () => {
    const mockForm = createMockForm();
    const timeThresholdForm = mockForm.get('timeThreshold');
    const timeWindowField = timeThresholdForm.get('timeWindow');

    render(<TimeThresholdViolationsInSequence form={mockForm} updateForm={updateForm} label={testLabel} />);

    const input = screen.getByTestId('timeWindowInput');

    // Change the input value to 10
    fireEvent.change(input, { target: { value: '10' } });

    // Wait for the debounce
    await new Promise(resolve => setTimeout(resolve, 300));

    // Check if the field was updated correctly
    // The value should be multiplied by granularity: 10 * 60000 = 600000
    expect(timeWindowField.setValue).toHaveBeenCalledWith(600000);
    expect(timeWindowField.setTouched).toHaveBeenCalledWith(true);

    // Check if updateForm was called with the updated form
    expect(mockForm.put).toHaveBeenCalledWith('timeThreshold', expect.anything());
    expect(updateForm).toHaveBeenCalledWith(mockForm);
  });

  it('should cap the input value at maxTimeWindow (12)', async () => {
    const mockForm = createMockForm();
    const timeThresholdForm = mockForm.get('timeThreshold');
    const timeWindowField = timeThresholdForm.get('timeWindow');

    render(<TimeThresholdViolationsInSequence form={mockForm} updateForm={updateForm} label={testLabel} />);

    const input = screen.getByTestId('timeWindowInput');

    // Change the input value to a value greater than maxTimeWindow (12)
    fireEvent.change(input, { target: { value: '15' } });

    // Wait for the debounce
    await new Promise(resolve => setTimeout(resolve, 300));

    // Check if the field was updated with the capped value
    // The value should be capped at 12 and then multiplied by granularity: 12 * 60000 = 720000
    expect(timeWindowField.setValue).toHaveBeenCalledWith(720000);
  });

  it('should render TouchedMessages component with the correct field', () => {
    const mockForm = createMockForm();

    render(<TimeThresholdViolationsInSequence form={mockForm} updateForm={updateForm} label={testLabel} />);

    // Check if TouchedMessages is rendered
    expect(screen.getByTestId('touched-messages')).toBeInTheDocument();
  });
});

// Made with Bob
