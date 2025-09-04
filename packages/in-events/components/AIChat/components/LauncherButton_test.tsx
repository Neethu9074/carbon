/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { LAUNCHER_BUTTON_ID, DRAGGABLE_ICON } from 'in-events/components/AIChat/utils/utils';
import { LauncherButton } from 'in-events/components/AIChat/components/LauncherButton';

// Mock the SvgIcon and CarbonButton components
jest.mock('@instana/components', () => ({
  SvgIcon: ({ type, size, className, id }: { type: string; size: string; className?: string; id?: string }) => (
    <div data-testid={`svg-icon-${type}`} className={className} id={id}>
      {type} {size}
    </div>
  ),
  CarbonButton: ({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) => (
    <button data-testid="carbon-button" className={className} id={id}>
      {children}
    </button>
  )
}));

describe('LauncherButton Component', () => {
  it('renders correctly with proper IDs', () => {
    render(<LauncherButton />);

    // Check if the button is rendered with the correct ID
    const button = screen.getByTestId('carbon-button');
    expect(button).toBeInTheDocument();
    expect(button.id).toBe(LAUNCHER_BUTTON_ID);

    // Check if the chat icon is rendered
    const chatIcon = screen.getByTestId('svg-icon-lib_launch_ai');
    expect(chatIcon).toBeInTheDocument();

    // Check if the draggable icon is rendered with the correct ID
    const dragIcon = screen.getByTestId('svg-icon-lib_actions_reorder');
    expect(dragIcon).toBeInTheDocument();
    expect(dragIcon.id).toBe(DRAGGABLE_ICON);
  });
});

// Made with Bob
