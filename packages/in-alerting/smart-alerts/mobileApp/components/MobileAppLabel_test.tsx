/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { useObservable } from '@instana/hooks';

import MobileAppLabel from 'in-alerting/smart-alerts/mobileApp/components/MobileAppLabel';

jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));

jest.mock('in-alerting/smart-alerts/components/list/ListSubtitle', () => ({
  ListSubtitle: ({ label, icon }: { label: string; icon: string }) => (
    <span data-testid="list-subtitle">
      {icon} - {label}
    </span>
  )
}));

describe('MobileAppLabel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders label and icon when label is available', () => {
    (useObservable as jest.Mock).mockReturnValue('Mobile App A');

    render(<MobileAppLabel mobileAppID="mobile-app-123" />);
    expect(screen.getByText('lib_mobile_app - Mobile App A')).toBeInTheDocument();
  });

  it('renders nothing when label is null', () => {
    (useObservable as jest.Mock).mockReturnValue(null);

    const { container } = render(<MobileAppLabel mobileAppID="mobile-app-123" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when label is undefined', () => {
    (useObservable as jest.Mock).mockReturnValue(undefined);

    const { container } = render(<MobileAppLabel mobileAppID="mobile-app-456" />);
    expect(container.firstChild).toBeNull();
  });
});
