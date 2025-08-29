/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import AssistMe from 'in-plg/components/AssistMe/AssistMe';

describe('AssistMe Component', () => {
  test('renders correctly', () => {
    render(<AssistMe />);
    const assistMeButton = screen.getByRole('button');
    expect(assistMeButton).toBeInTheDocument();
    expect(assistMeButton).toHaveAttribute('id', 'wm-getanswers');
  });

  test('has tooltip with correct content', async () => {
    const event = userEvent.setup();
    render(<AssistMe />);

    const assistMeButton = screen.getByRole('button');
    expect(assistMeButton).toBeInTheDocument();
    expect(assistMeButton).toHaveAttribute('id', 'wm-getanswers');

    // Hover over the button to show the tooltip
    await event.hover(assistMeButton);

    // Use findByText instead of getByText to handle any delay in tooltip appearing
    const tooltipContent = await screen.findByText('Guided answers here');
    expect(tooltipContent).toBeInTheDocument();
  });
});
