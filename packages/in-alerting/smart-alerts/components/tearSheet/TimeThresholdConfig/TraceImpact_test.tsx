/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { MapForm, Field } from 'formalistic';
import React from 'react';

import TraceImpact from 'in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/TraceImpact';

// Mock dependencies
jest.mock('in-i18n', () => ({
  t: jest.fn(key => key)
}));

jest.mock('in-components/form/TouchedMessages/TouchedMessages', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="touched-messages" />)
}));

describe('TraceImpact : in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/TraceImpact', () => {
  const updateForm = jest.fn();

  // Helper function to create a mock form
  const createMockForm = (requestsValue = 5) => {
    const requestsField = {
      value: requestsValue,
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
              if (nestedKey === 'requests') {
                return requestsField;
              }
              return null;
            }),
            updateIn: jest.fn().mockImplementation((path, updaterFn) => {
              // Correctly handle the updateIn method by calling the updater function with the field
              if (path[0] === 'requests') {
                updaterFn(requestsField);
              }
              return {
                /* updated form */
              };
            }),
            toJS: jest.fn().mockReturnValue({})
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

    render(<TraceImpact form={mockForm} updateForm={updateForm} />);

    // Check if the label is rendered
    expect(
      screen.getByText('in-alerting:smartAlerts.components.tearSheet.timeThreshold.numberOfTracesImpacted')
    ).toBeInTheDocument();

    // Check if the input is rendered with the correct value
    const input = screen.getByTestId('traceImpactInput');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('value', '5');
    expect(input).toHaveAttribute('min', '1');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('should call updateForm when input value changes', async () => {
    const mockForm = createMockForm();

    render(<TraceImpact form={mockForm} updateForm={updateForm} />);

    const input = screen.getByTestId('traceImpactInput');

    // Change the input value
    fireEvent.change(input, { target: { value: 10 } });

    // Wait for the debounce
    await new Promise(resolve => setTimeout(resolve, 300));

    // Check if updateForm was called
    expect(updateForm).toHaveBeenCalled();
  });

  it('should update the form with the new value and set touched to true', async () => {
    const mockForm = createMockForm();
    const timeThresholdForm = mockForm.get('timeThreshold');
    const requestsField = timeThresholdForm.get('requests');

    render(<TraceImpact form={mockForm} updateForm={updateForm} />);

    const input = screen.getByTestId('traceImpactInput');

    // Change the input value
    fireEvent.change(input, { target: { value: '10' } });

    // Wait for the debounce
    await new Promise(resolve => setTimeout(resolve, 300));

    // Check if the field was updated correctly
    expect(requestsField.setValue).toHaveBeenCalledWith('10');
    expect(requestsField.setTouched).toHaveBeenCalledWith(true);

    // Check if updateForm was called with the updated form
    expect(mockForm.put).toHaveBeenCalledWith('timeThreshold', expect.anything());
    expect(updateForm).toHaveBeenCalledWith(mockForm);
  });

  it('should render TouchedMessages component with the correct field', () => {
    const mockForm = createMockForm();

    render(<TraceImpact form={mockForm} updateForm={updateForm} />);

    // Check if TouchedMessages is rendered
    expect(screen.getByTestId('touched-messages')).toBeInTheDocument();
  });
});

// Made with Bob
