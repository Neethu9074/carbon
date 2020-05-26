import React from 'react';

import ReleaseStatusRow from 'in-events/releases/ReleaseStatusRow';

export default {
  title: 'Molecules|ReleaseStatusRow',
  component: ReleaseStatusRow
};

export function MarkerRowAsc() {
  return <ReleaseStatusRow rawEvent={getRawEvent()} healthStatus={getHealthData()} sortDirection="asc" />;
}

function startDate(minutes) {
  const d = new Date();
  d.setMinutes(d.getMinutes() - minutes);
  return d;
}

function getRawEvent() {
  return {
    id: 'ABC4567',
    title: 'v147-eu-prod',
    start: startDate(10)
  };
}

function getHealthData() {
  return {
    before: {
      incidents: 2,
      health: 0.9998123123123123123,
      start: startDate(20),
      end: startDate(10)
    },
    after: {
      incidents: 7,
      health: 0.9954843026473247835,
      start: startDate(20),
      end: startDate(10)
    }
  };
}
