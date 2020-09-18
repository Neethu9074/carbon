import React from 'react';

import { AlertHistoryListPresenter } from 'in-new-components/Alerting/components/AlertHistoryList';

export default {
  title: 'Templates/website/alerting/components/AlertHistoryListPresenter',
  component: AlertHistoryListPresenter
};

const rawEventsWhileEmpty = {
  data: {
    items: [],
    totalRepresentedItemCount: 0
  }
};
export const empty = () => <AlertHistoryListPresenter rawEvents={rawEventsWhileEmpty} />;

const rawEventsWhileLoading = { progress: { loading: true } };
export const Loading = () => <AlertHistoryListPresenter rawEvents={rawEventsWhileLoading} />;

const severities = [0, 5, 6, 10];
const events = severities.map(s => ({
  type: 'issue',
  entityId: 'XkLX4CD7RfKLYa70wqZSdQ',
  severity: s,
  start: 1587074400000 + 1000 * s
}));

function withType(type) {
  return event => ({ ...event, type });
}

export const issues = () => (
  <AlertHistoryListPresenter
    rawEvents={{
      data: {
        items: events.map(withType('issue')),
        totalRepresentedItemCount: events.length
      }
    }}
  />
);

export const incidents = () => (
  <AlertHistoryListPresenter
    rawEvents={{
      data: {
        items: events.map(withType('incident')),
        totalRepresentedItemCount: incidents.length
      }
    }}
  />
);
