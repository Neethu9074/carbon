/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';

import { generateUniqueShortId } from '@instana/utils';

import Entry from 'in-synthetics/dashboards/details/components/Entry';

describe(Entry, () => {
  afterEach(() => {
    cleanup();
  });

  it('Render Entry with type as OTHER if content type is undefined', () => {
    const dummyEntryOtherType = {
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
    };
    render(
      <Entry
        key={generateUniqueShortId()}
        entry={dummyEntryOtherType}
        earliestTimestamp={1713424742828}
        endTimestamp={1713424752431}
      />
    );
    expect(screen.getByText('OTHER')).toBeVisible();
  });

  it('Render Entry with type as DOC if content type is Document', () => {
    const dummyEntryDocType = {
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
    };
    render(
      <Entry
        key={generateUniqueShortId()}
        entry={dummyEntryDocType}
        earliestTimestamp={1713424742828}
        endTimestamp={1713424752431}
      />
    );
    expect(screen.getByText('DOC')).toBeVisible();
  });
});
