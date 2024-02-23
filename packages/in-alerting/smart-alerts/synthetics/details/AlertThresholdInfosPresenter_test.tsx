/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { AlertThresholdInfosPresenter } from 'in-alerting/smart-alerts/synthetics/details/AlertThresholdInfosPresenter';

const props = {
  thresholdTypeLabel: 'Number of failure',
  metricLabel: '1 failures',
  scopeLabel: 'Per Location'
};

describe('in-alerting/smart-alerts/synthetics/details/AlertThresholdInfosPresenter.tsx', () => {
  it('renders the correct thresholdTypeLabel', () => {
    render(<AlertThresholdInfosPresenter {...props} />);
    expect(screen.getByText(props.thresholdTypeLabel)).toBeInTheDocument();
  });

  it('renders the correct metric with metricLabel', () => {
    render(<AlertThresholdInfosPresenter {...props} />);
    expect(screen.getByText(props.metricLabel)).toBeInTheDocument();
  });

  it('renders the correct scopeLabel', () => {
    render(<AlertThresholdInfosPresenter {...props} />);
    expect(screen.getByText(props.scopeLabel)).toBeInTheDocument();
  });
});
