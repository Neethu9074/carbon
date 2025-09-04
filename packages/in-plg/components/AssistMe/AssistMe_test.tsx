/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import AssistMe from 'in-plg/components/AssistMe/AssistMe';

describe('AssistMe Component', () => {
  test('renders correctly', () => {
    render(<AssistMe />);
    const assistMeButton = screen.getByRole('button');
    expect(assistMeButton).toBeInTheDocument();
    expect(assistMeButton).toHaveAttribute('id', 'wm-getanswers');
  });

  test('has tooltip with correct content', () => {
    render(<AssistMe />);
    const tooltipContent = screen.getByText('Guided answers here');
    expect(tooltipContent).toBeInTheDocument();
  });
});
