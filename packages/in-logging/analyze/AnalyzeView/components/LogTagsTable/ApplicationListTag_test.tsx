/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { ApplicationsList } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable/ApplicationsListTag';
import { ApplicationsListTag } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable/index';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';

jest.mock('in-services/tracking/useSegmentTracking');

const mockProps = {
  resolvedValue: '3 applications',
  stringValue: 'id1,id2,id3',
  item: {
    itemId: '12345',
    timestamp: 1735121771333,
    message: 'This is not a real log',
    tags: [
      {
        name: 'log.level',
        stringValue: 'ERROR'
      },
      {
        name: 'log.custom',
        key: 'application_ids',
        stringValue: 'id1,id2,id3'
      }
    ]
  }
};

describe('ApplicationListTag', () => {
  const mockTrackCta = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSegmentTracking as jest.Mock).mockReturnValue({ trackCta: mockTrackCta });
  });

  it('should render application list tag if app ids are available', () => {
    const { getByText } = render(<ApplicationsListTag {...mockProps} />);

    expect(getByText(mockProps.resolvedValue)).toBeInTheDocument();
  });

  it('should render application list when clicked', () => {
    const appIds = mockProps.stringValue.split(',');
    render(<ApplicationsList item={mockProps.item} applicationIds={appIds} />);

    const appLink = screen.getByText(appIds[0]);
    expect(appLink).toBeInTheDocument();
    expect(appLink).toHaveAttribute('href', `/#/application;appId=${appIds[0]}/summary`);

    fireEvent.click(appLink);

    expect(mockTrackCta).toHaveBeenCalled();
  });
});
