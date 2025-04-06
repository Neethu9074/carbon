/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import ActionDashboard from 'in-automation/ActionDashboard/ActionDashboard';

describe('ActionDashboard', () => {
  it('renders correctly', () => {
    render(<ActionDashboard />);
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Configuration')).toBeInTheDocument();
  });
});
