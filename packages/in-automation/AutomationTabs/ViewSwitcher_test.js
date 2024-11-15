/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, fireEvent } from '@testing-library/react';
import React from 'react';

import * as NavigationHooks from 'in-stores/navigation/hooks/useNavigation';
import ViewSwitcher from 'in-automation/AutomationTabs/ViewSwitcher';
import { useSegmentTracker } from 'in-automation/tracker';
import { t } from 'in-i18n';

jest.mock('in-i18n', () => ({
  t: jest.fn(key => key)
}));
jest.mock('in-stores/navigation/hooks/useNavigation', () => ({
  useNavigation: jest.fn()
}));
jest.mock('in-automation/tracker', () => ({
  useSegmentTracker: jest.fn()
}));

const mockMatchLocation = jest.fn();
const mockCreateHrefToPath = jest.fn();
const mockActionHistoryTrackerSegment = jest.fn();

beforeEach(() => {
  // Reset all implementations
  t.mockClear();
  mockMatchLocation.mockReset();
  mockCreateHrefToPath.mockReset();
  mockActionHistoryTrackerSegment.mockReset();

  // Setup default implementations
  NavigationHooks.useNavigation.mockImplementation(() => ({
    matchLocation: mockMatchLocation,
    createHrefToPath: mockCreateHrefToPath
  }));

  useSegmentTracker.mockImplementation(() => ({
    actionHistoryTrackerSegment: mockActionHistoryTrackerSegment
  }));

  // Example paths
  mockMatchLocation.mockImplementation(path => path === 'expectedActivePath');
  mockCreateHrefToPath.mockImplementation(path => `href-${path}`);
  mockActionHistoryTrackerSegment.mockImplementation();
});

// Test cases
describe('ViewSwitcher Component', () => {
  test('renders correctly with initial props', () => {
    const { getByText } = render(<ViewSwitcher />);
    expect(getByText('in-automation:automation')).toBeInTheDocument();
    expect(getByText('in-automation:ActionCatalog.actionCatalog')).toBeInTheDocument();
    expect(getByText('in-automation:actionHistory.actionHistory')).toBeInTheDocument();
    expect(getByText('in-automation:policies.policies')).toBeInTheDocument();
  });

  test('click on action history link triggers the history tracker', () => {
    const { getByText } = render(<ViewSwitcher />);
    const actionHistoryLink = getByText('in-automation:actionHistory.actionHistory');
    fireEvent.click(actionHistoryLink);
    expect(mockActionHistoryTrackerSegment).toHaveBeenCalled();
  });
});
