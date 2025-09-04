/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArrowRight } from '@carbon/icons-react';

import * as useOnboardingTileDataModule from 'in-plg/pages/WelcomePage/GettingStarted/OnboardingTileData';
import GettingStartedContent from 'in-plg/pages/WelcomePage/GettingStarted/GettingStartedContent';

jest.mock('@instana/i18n-react', () => ({
  t: (key: string) => key
}));

jest.mock('in-services/tracking/useSegmentTracking', () => ({
  useSegmentTracking: () => ({
    trackCta: jest.fn()
  })
}));

jest.mock('in-services/featureFlags', () => ({
  isFeatureFlagEnabled: jest.fn().mockReturnValue(false),
  newOTelPageEnabled: false
}));

jest.mock('in-plg/pages/WelcomePage/GettingStarted/assets/VideoImage.png', () => 'mock-image-path');

describe('GettingStartedContent', () => {
  const mockDefaultTasks = [
    {
      key: 'startIntegrating',
      title: 'Set up first datasource',
      href: '/agents/installation',
      trackingEvent: 'UNIT_ONBOARDING_START_INTEGRATING_CLICK',
      pictogram: ArrowRight,
      isActionCompleted: false
    }
  ];
  const mockCompletedTasks = [
    {
      key: 'monitorWebsite',
      title: 'Monitor Website',
      href: '/websiteMonitoring/websites',
      trackingEvent: 'UNIT_ONBOARDING_MONITOR_ENVIRONMENT_CLICK',
      pictogram: ArrowRight,
      isActionCompleted: true
    }
  ];
  beforeEach(() => {
    jest.spyOn(useOnboardingTileDataModule, 'useOnboardingTileData').mockReturnValue({
      defaultTasks: mockDefaultTasks,
      completedTasks: mockCompletedTasks
    });
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('renders default tasks', () => {
    render(<GettingStartedContent activation={{}} />);
    const taskElements = screen.getAllByText('Set up first datasource');
    expect(taskElements.length).toBeGreaterThan(0);
    expect(screen.queryAllByText('Monitor Website').length).toBe(0);
  });
  it('toggles completed tasks when button clicked', () => {
    render(<GettingStartedContent activation={{}} />);
    const toggleBtn = screen.getByRole('button', {
      name: 'in-plg:onboarding.showCompleted'
    });
    fireEvent.click(toggleBtn);
    const completedTaskElements = screen.getAllByText('Monitor Website');
    expect(completedTaskElements.length).toBeGreaterThan(0);
    expect(
      screen.getByRole('button', {
        name: 'in-plg:onboarding.hideCompleted'
      })
    ).toBeInTheDocument();
  });
  it('does not render toggle button if no completed tasks', () => {
    (useOnboardingTileDataModule.useOnboardingTileData as jest.Mock).mockReturnValue({
      defaultTasks: mockDefaultTasks,
      completedTasks: []
    });
    render(<GettingStartedContent activation={{}} />);
    expect(
      screen.queryByRole('button', {
        name: 'in-plg:onboarding.showCompleted'
      })
    ).not.toBeInTheDocument();
  });
  it('renders videos section', () => {
    render(<GettingStartedContent activation={{}} />);
    expect(screen.getByText('in-plg:onboarding.videotitle')).toBeInTheDocument();
  });
  it('renders community blogs section', () => {
    render(<GettingStartedContent activation={{}} />);
    expect(screen.getByText('in-plg:onboarding.communityblogs.title')).toBeInTheDocument();
  });
});
