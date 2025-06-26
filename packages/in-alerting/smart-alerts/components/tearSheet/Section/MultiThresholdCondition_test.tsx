/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import MultiThresholdCondition from 'in-alerting/smart-alerts/components/tearSheet/Section/MultiThresholdCondition';
//@ts-expect-error
import { alertConfig } from 'in-alerting/smart-alerts/infrastructure/data/testData';
import alertFormDefinition from 'in-alerting/smart-alerts/infrastructure/form/alertFormDefinition';

const mockUpdateForm = jest.fn();
const mockSetValidNextValue = jest.fn();

describe('MultiThresholdCondition', () => {
  const form = alertFormDefinition(alertConfig, false);
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders warning and critical threshold checkboxes', () => {
    render(
      <MultiThresholdCondition
        form={form}
        updateForm={mockUpdateForm}
        alertChannelPerSeverityEnabled={false}
        metricUnitPostfix={'ms'}
      />
    );

    expect(screen.getByLabelText(/warning/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/critical/i)).toBeInTheDocument();
  });

  it('calls updateForm when warning threshold checkbox toggled and setValidNextValue is not provided', () => {
    render(
      <MultiThresholdCondition
        form={form}
        updateForm={mockUpdateForm}
        alertChannelPerSeverityEnabled={false}
        metricUnitPostfix={'ms'}
      />
    );

    const checkbox = screen.getByLabelText(/warning/i);
    fireEvent.click(checkbox);

    expect(mockUpdateForm).toHaveBeenCalled();
  });

  it('calls setValidNextValue when warning threshold checkbox toggled and prop is provided', () => {
    render(
      <MultiThresholdCondition
        form={form}
        updateForm={mockUpdateForm}
        setValidNextValue={mockSetValidNextValue}
        alertChannelPerSeverityEnabled={false}
        metricUnitPostfix={'ms'}
      />
    );

    const checkbox = screen.getByLabelText(/warning/i);
    fireEvent.click(checkbox);

    expect(mockSetValidNextValue).toHaveBeenCalledWith(
      expect.objectContaining({
        isChecked: expect.any(Boolean),
        thresholdType: 'warningThreshold'
      })
    );
  });

  it('does not render UseSuggestedValueButton when groupBy is present and showSuggestedValueButton=false', () => {
    render(
      <MultiThresholdCondition
        form={form}
        updateForm={mockUpdateForm}
        alertChannelPerSeverityEnabled={false}
        groupBy={['env']}
        showSuggestedValueButton={false}
        metricUnitPostfix={'ms'}
      />
    );

    expect(screen.queryByRole('button', { name: /use suggested value/i })).not.toBeInTheDocument();
  });

  it('displays helper text info', () => {
    render(
      <MultiThresholdCondition
        form={form}
        updateForm={mockUpdateForm}
        alertChannelPerSeverityEnabled={false}
        metricUnitPostfix={'ms'}
      />
    );

    expect(
      screen.getByText(/Your input of either threshold value triggers an alert notification./i)
    ).toBeInTheDocument();
  });
});
