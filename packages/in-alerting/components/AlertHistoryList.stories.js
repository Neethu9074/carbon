/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { AlertHistoryListPresenter } from 'in-alerting/components/AlertHistoryList';

export default {
  component: AlertHistoryListPresenter
};

export function empty() {
  return (
    <AlertHistoryListPresenter
      tableProps={{
        items: [],
        totalRepresentedItemCount: 0
      }}
    />
  );
}

export function Loading() {
  return (
    <AlertHistoryListPresenter
      tableProps={{
        progress: {
          loading: true
        }
      }}
    />
  );
}

export function issues() {
  const events = eventsWithType('issue');
  return (
    <AlertHistoryListPresenter
      tableProps={{
        items: events,
        totalRepresentedItemCount: events.length
      }}
    />
  );
}

export function incidents() {
  const events = eventsWithType('incident');
  return (
    <AlertHistoryListPresenter
      tableProps={{
        items: events,
        totalRepresentedItemCount: events.length
      }}
    />
  );
}

const eventsWithType = type => {
  return [0, 5, 6, 10].map(severity => ({
    id: 'event-id-' + severity,
    type,
    entityId: 'XkLX4CD7RfKLYa70wqZSdQ',
    severity,
    start: 1587074400000 + 1000 * severity
  }));
};
