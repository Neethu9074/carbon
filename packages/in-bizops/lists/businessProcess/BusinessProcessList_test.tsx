/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import BizOpsList from 'in-bizops/lists/businessProcess/BusinessProcessList';

describe('BizOpsList', () => {
  it('should render a business processes table', () => {
    render(<BizOpsList />);

    // Columns
    expect(screen.getByText(/Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Started/i)).toBeInTheDocument();
    //expect(screen.getByText(/Activities/i)).toBeInTheDocument();

    // Table body - Should currently diplay empty state
    //expect(screen.getAllByText(/No data available/i)[0]).toBeInTheDocument();
  });
});
