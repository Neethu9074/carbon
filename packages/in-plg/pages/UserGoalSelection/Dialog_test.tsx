/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import UserGoalSelectionDialog from 'in-plg/pages/UserGoalSelection/Dialog';
import { segmentTrackingFunc } from 'in-plg/utils/Segment/segment';

jest.mock('in-components/DialogPresenter/store', () => ({
  close: jest.fn()
}));

jest.mock('in-plg/utils/Segment/segment', () => ({
  __esModule: true,
  segmentTrackingFunc: jest.fn(() => ({
    activeLicense: 'selfService'
  }))
}));

const ctaClicked = 'CTA Clicked';

describe('in-plg/pages/UserGoalSelectionDialog', () => {
  test('should show dialog', () => {
    render(<UserGoalSelectionDialog />);
    screen.findByText('What are your goals?');
  });

  test('should send the selected goal to segment', () => {
    const { container } = render(<UserGoalSelectionDialog />);
    const checkbox = container.querySelector('input[type="checkbox"]');
    const doneButton = screen.getByText('Done');
    expect(checkbox).toBeInTheDocument();
    fireEvent.click(checkbox as any);
    fireEvent.click(doneButton as any);

    expect(segmentTrackingFunc).toHaveBeenCalledWith(
      'User goal: Improve website and API performance management',
      ctaClicked
    );
  });

  test('should display other goal input field and send its value to segment', () => {
    const { container } = render(<UserGoalSelectionDialog />);
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    const lastCheckbox = checkboxes[checkboxes.length - 1];
    fireEvent.click(lastCheckbox as any);
    const textArea = container.querySelector('textArea');
    const value = 'New value';
    fireEvent.change(textArea as any, { target: { value } });
    const doneButton = screen.getByText('Done');
    fireEvent.click(doneButton as any);
    expect(textArea).toBeInTheDocument();
    expect(segmentTrackingFunc).toHaveBeenLastCalledWith('User goal: Other goal', ctaClicked, value);
  });
});
