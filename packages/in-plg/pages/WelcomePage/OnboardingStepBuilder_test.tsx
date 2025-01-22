/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import OnboardingStepBuilder from 'in-plg/pages/WelcomePage/OnboardingStepBuilder';
import { eventTracker } from 'in-services/tracking/segment/EventTracker';

jest.mock('in-services/tracking/segment/EventTracker', () => ({
  eventTracker: jest.fn()
}));

jest.mock('in-components/ViewTrackingMeta', () => ({
  getViewTrackingMetaData: () => ({
    pageRootName: 'home',
    productArea: 'instana'
  })
}));

describe('in-plg/pages/WelcomePage/OnboardingStepBuilder', () => {
  const expectedText = 'Start integrating data';
  const currentTenantUnit = 'instana#test';
  const accountActivationData = {
    [currentTenantUnit]: {
      fa: { status: false }
    }
  };

  it('should render OnboardingStepBuilder', () => {
    render(<OnboardingStepBuilder activation={accountActivationData} />);
    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });

  it('OnboardingStepBuilder buttons should send segment events', () => {
    const { container } = render(<OnboardingStepBuilder activation={accountActivationData} />);
    const buttons = container.querySelectorAll('[data-test-id="tile-button"]');
    buttons.forEach(button => {
      fireEvent.click(button as any);
    });
    expect(eventTracker).toHaveBeenCalled();
  });

  it('should not render OnboardingStepBuilder data', () => {
    render(<OnboardingStepBuilder activation={null} />);
    expect(screen.queryByText(expectedText)).not.toBeInTheDocument();
  });
});
