/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';

import BrowserTimeline from 'in-synthetics/dashboards/details/components/browser/BrowserTimeline';

describe(BrowserTimeline, () => {
  afterEach(() => {
    cleanup();
  });

  it('Render BrowserTimeline if content type is defined', () => {
    const dummyEntriesDocType = [
      {
        _resourceType: 'document',
        cache: {},
        connection: '87',
        id: '1b91983f5127d092',
        pageref: 'page_1',
        serverIPAddress: '9.30.161.95',
        startedDateTime: '2024-04-18T10:04:03.600Z',
        time: 134.2749,
        request: {
          url: 'https://www.ibm.com'
        },
        response: {
          status: 200,
          size: 5233,
          content: {
            type: 'Document'
          }
        },
        timings: {}
      }
    ];
    render(
      <BrowserTimeline
        width={100}
        entriesToRender={dummyEntriesDocType}
        earliestTimestamp={1713424742828}
        endTimestamp={1713424752431}
      />
    );
    expect(screen.getByTestId('timeline-container')).toBeVisible();
  });

  it('Render BrowserTimeline even if content type is undefined', () => {
    const dummyEntriesOtherType = [
      {
        _resourceType: 'document',
        cache: {},
        connection: '87',
        id: '1b91983f5127d092',
        pageref: 'page_1',
        serverIPAddress: '9.30.161.95',
        startedDateTime: '2024-04-18T10:04:03.600Z',
        time: 134.2749,
        request: {
          url: 'https://www.ibm.com'
        },
        response: {
          status: 200,
          size: 5233,
          content: {}
        },
        timings: {}
      }
    ];
    render(
      <BrowserTimeline
        width={600}
        entriesToRender={dummyEntriesOtherType}
        earliestTimestamp={1713424742828}
        endTimestamp={1713424752431}
      />
    );
    expect(screen.getByTestId('timeline-container')).toBeVisible();
  });
});
