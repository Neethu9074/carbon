/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import AutomationCardButtonGroup from 'in-automation/AutomationCard/AutomationCardButtonGroup';

// Mock the imported functions
const mockSetActiveKey = jest.fn();

jest.mock('in-automation/AutomationCard/AutomationCardButtonGroup', () => {
  const originalModule = jest.requireActual('in-automation/AutomationCard/AutomationCardButtonGroup');
  return {
    __esModule: true,
    ...originalModule,
    setActiveKey: mockSetActiveKey,
    useActiveKey: jest.fn().mockReturnValue('recommendedActions'),
    default: originalModule.default
  };
});

jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn().mockReturnValue('recommendedActions')
}));

jest.mock('in-automation/tracker', () => {
  const mockRecommendedActionsTabClickTrackerSegment = jest.fn();
  return {
    useSegmentTracker: jest.fn().mockReturnValue({
      recommendedActionsTabClickTrackerSegment: mockRecommendedActionsTabClickTrackerSegment
    })
  };
});

jest.mock('in-stores/store', () => ({
  createStore: jest.fn().mockReturnValue({
    observable: {
      subscribe: jest.fn()
    },
    mutateTo: jest.fn()
  })
}));

jest.mock('in-i18n', () => ({
  t: (key: string, options?: any) => {
    if (key === 'in-automation:recommendedActionsWithCount') {
      return `automation.card.recommended_actions (${options?.count})`;
    }
    if (key === 'in-automation:recommendedActions') {
      return 'automation.card.recommended_actions';
    }
    if (key === 'in-automation:actionHistory.actionHistoryWithCount') {
      return `automation.card.action_history (${options?.count})`;
    }
    if (key === 'in-automation:actionHistory.actionHistory') {
      return 'automation.card.action_history';
    }
    return key;
  }
}));

describe('AutomationCardButtonGroup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the button group with correct tabs', () => {
    render(<AutomationCardButtonGroup recommendedActionsCount={3} actionHistoryCount={5} />);

    // Check if both tabs are rendered
    expect(screen.getByText('automation.card.recommended_actions (3)')).toBeInTheDocument();
    expect(screen.getByText('automation.card.action_history (5)')).toBeInTheDocument();
  });

  it('renders without counts when they are undefined', () => {
    render(<AutomationCardButtonGroup recommendedActionsCount={undefined} actionHistoryCount={undefined} />);

    // Check if both tabs are rendered without counts
    expect(screen.getByText('automation.card.recommended_actions')).toBeInTheDocument();
    expect(screen.getByText('automation.card.action_history')).toBeInTheDocument();
  });

  it('returns null when hasRCA is true', () => {
    const { container } = render(
      <AutomationCardButtonGroup recommendedActionsCount={3} actionHistoryCount={5} hasRCA />
    );

    expect(container.firstChild).toBeNull();
  });

  it.skip('calls setActiveKey when clicking on a tab', () => {
    render(<AutomationCardButtonGroup recommendedActionsCount={3} actionHistoryCount={5} />);

    fireEvent.click(screen.getByText('automation.card.action_history (5)'));

    expect(mockSetActiveKey).toHaveBeenCalledWith('actionHistory');
  });

  it.skip('calls recommendedActionsTabClickTrackerSegment when clicking on recommended actions tab', () => {
    const mockTracker = {
      recommendedActionsTabClickTrackerSegment: jest.fn()
    };

    // Mock the useSegmentTracker hook
    require('in-automation/tracker').useSegmentTracker.mockReturnValue(mockTracker);

    render(<AutomationCardButtonGroup recommendedActionsCount={3} actionHistoryCount={5} />);

    fireEvent.click(screen.getByText('automation.card.recommended_actions (3)'));

    expect(mockSetActiveKey).toHaveBeenCalledWith('recommendedActions');
  });
});
