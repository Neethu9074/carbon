/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { BuyNowDialog } from 'in-plg/components/BuyNowDialog/BuyNowDialog';

describe('BuyNowDialog Component', () => {
  test('renders correctly', () => {
    render(<BuyNowDialog />);
    const element = screen.getByText('Flexible billing based on your usage');
    expect(element).toBeInTheDocument();
  });
});
