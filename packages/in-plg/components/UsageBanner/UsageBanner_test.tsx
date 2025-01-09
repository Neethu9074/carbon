/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { UsageBanner } from 'in-plg/components/UsageBanner/UsageBanner';

describe('UsageBanner Component', () => {
  test('renders correctly', () => {
    const content = 'messagex';
    render(<UsageBanner message={{ type: 'warning', activeLicense: 'quota', remainingDays: 15, content }} />);
    const element = screen.getByText(content);
    expect(element).toBeInTheDocument();
  });
});
