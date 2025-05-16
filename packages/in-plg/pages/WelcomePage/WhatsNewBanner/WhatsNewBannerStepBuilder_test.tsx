/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import WhatsNewBannerStepBuilder from 'in-plg/pages/WelcomePage/WhatsNewBanner/WhatsNewBannerStepBuilder';

jest.mock('in-services/tracking/segment/EventTracker', () => ({
  eventTracker: jest.fn()
}));

jest.mock('in-components/ViewTrackingMeta', () => ({
  getViewTrackingMetaData: () => ({
    pageRootName: 'home',
    productArea: 'instana'
  })
}));

describe('in-plg/pages/WelcomePage/WhatsNewBanner/WhatsNewBannerStepBuilder', () => {
  const kubecostText = 'Cost visibility with IBM Kubecost';
  const loggingText = 'Instana logging';
  const turbonometricText = 'Resource actions,powered by Turbonometric';
  const concertText = 'AI driven insights with IBM concerts';
  it('should render WhatsNewBannerStepBuilder', () => {
    render(<WhatsNewBannerStepBuilder />);
    expect(screen.getByText(kubecostText)).toBeInTheDocument();
    expect(screen.getByText(loggingText)).toBeInTheDocument();
    expect(screen.getByText(turbonometricText)).toBeInTheDocument();
    expect(screen.getByText(concertText)).toBeInTheDocument();
  });
  it('WhatsNewBannerStepBuilder buttons should have one primary and the the rest as ghost button', () => {
    const { container } = render(<WhatsNewBannerStepBuilder />);
    const buttons = container.querySelectorAll('[data-test-id="tile-button"]');
    expect(buttons.length).toBeGreaterThan(0);
    expect(buttons[0].classList.contains('cds--btn--primary')).toBe(true);
    for (let i = 1; i < buttons.length; i++) {
      expect(buttons[i].classList.contains('cds--btn--ghost')).toBe(true);
    }
  });
});
