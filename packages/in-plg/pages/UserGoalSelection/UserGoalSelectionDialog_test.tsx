/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { t } from '@instana/i18n-react';

import UserGoalSelectionDialog from 'in-plg/pages/UserGoalSelection/UserGoalSelectionDialog';
import { GOAL_SELECTION } from 'in-plg/pages/UserGoalSelection/utils/consts';

const { useSegmentTracking } = require('in-services/tracking/useSegmentTracking');

jest.mock('in-components/DialogPresenter/store', () => ({
  close: jest.fn()
}));

jest.mock('in-services/tracking/useSegmentTracking');

useSegmentTracking.mockReturnValue({
  unstable_trackEvent: jest.fn(),
  trackCta: jest.fn()
});

const ctaClicked = 'CTA Clicked';

describe('in-plg/pages/UserGoalSelectionDialog', () => {
  const { trackCta, unstable_trackEvent } = useSegmentTracking();

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

    expect(trackCta).toHaveBeenCalledWith('User goal: Improve website and API performance management');
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
    expect(unstable_trackEvent).toHaveBeenLastCalledWith(ctaClicked, { CTA: 'User goal: Other goal', message: value });
  });

  test('should instrument the close action of goal selection to the segment', () => {
    const { container } = render(<UserGoalSelectionDialog />);
    const closeButton = container.querySelector('button');
    fireEvent.click(closeButton as any);
    expect(trackCta).toHaveBeenLastCalledWith(GOAL_SELECTION.SEGMENT_MESSAGE.CLOSE);
  });

  test('should instrument the skip action of goal selection to the segment', () => {
    render(<UserGoalSelectionDialog />);
    const skipButton = screen.getByText(t('in-plg:userGoalSelectionDialog.skip'));
    fireEvent.click(skipButton as any);
    expect(trackCta).toHaveBeenLastCalledWith(GOAL_SELECTION.SEGMENT_MESSAGE.SKIP);
  });
});
