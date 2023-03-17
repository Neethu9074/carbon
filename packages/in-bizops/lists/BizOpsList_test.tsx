/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import BizOpsList from './BizOpsList';

describe('BizOpsList', () => {
  it('should render a business processes table', () => {
    render(<BizOpsList />);

    // Columns
    expect(screen.getByText(/process id/i)).toBeInTheDocument();
    expect(screen.getByText(/activity count/i)).toBeInTheDocument();
    expect(screen.getByText(/tool/i)).toBeInTheDocument();

    // Table body - Should currently diplay empty state
    expect(screen.getAllByText(/no data available/i)[0]).toBeInTheDocument();
  });
});
