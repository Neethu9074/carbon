/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { useParamTagLinks } from 'in-logging/analyze/AnalyzeView/components/hooks/useParamTagLinks';
import LogMessage from 'in-logging/analyze/AnalyzeView/components/LogMessage';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';

jest.mock('in-services/tracking/useSegmentTracking');
jest.mock('in-logging/analyze/AnalyzeView/components/hooks/useParamTagLinks');

// TODO: Expand to cover the overlay menu for message parameters (quick filter and group)
describe('LogMessage', () => {
  const mockTrackCta = jest.fn();
  const mockGetHrefWithAdditionalTagFilter = jest.fn();
  const mockGetHrefToGroupedView = jest.fn();

  const tagValue = '99.99.99.99';
  const mockTag = {
    name: 'log.custom',
    key: '_msg_param1',
    stringValue: tagValue
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSegmentTracking as jest.Mock).mockReturnValue({ trackCta: mockTrackCta });
    (useParamTagLinks as jest.Mock).mockReturnValue({
      getHrefWithAdditionalTagFilter: mockGetHrefWithAdditionalTagFilter,
      getHrefToGroupedView: mockGetHrefToGroupedView
    });
  });

  it('renders plain message correctly', () => {
    const message = 'Test message';
    render(<LogMessage tags={[]} message={message} />);

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('renders parameter value correctly', () => {
    render(<LogMessage tags={[mockTag]} message="Message with {}" />);

    expect(screen.getByText(tagValue)).toBeInTheDocument();
  });
});
