import React from 'react';

import { AlertHistoryListPresenter } from 'in-new-components/Alerting/components/AlertHistoryList';

export default {
  title: 'Templates|website/alerting/components/AlertHistoryListPresenter',
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

const severities = [0, 1, 5, 6, 10];
const event = severities.map(s => ({
  type: 'issue',
  entityId: 'XkLX4CD7RfKLYa70wqZSdQ',
  severity: s,
  start: 1587074400000 + 1000 * s,
}));
const issuesWithAllSeverities = event.map(item => ({...item, type: 'incident'}));

const incidentsWithAllSeverities = issuesWithAllSeverities.map(event => ({...event, type: 'incident'}));

const issuesWithAllSeveritiesEvents = {
  data: {
    items: [...issuesWithAllSeverities],
    totalRepresentedItemCount: issuesWithAllSeverities.length
  }
};
export const issues = () => <AlertHistoryListPresenter rawEvents={issuesWithAllSeveritiesEvents} />;

const incidentsWithAllSeveritiesEvents = {
  data: {
    items: [...incidentsWithAllSeverities],
    totalRepresentedItemCount: incidentsWithAllSeverities.length
  }
};
export const incidents = () => <AlertHistoryListPresenter rawEvents={incidentsWithAllSeveritiesEvents} />;
