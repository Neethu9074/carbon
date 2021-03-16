import React from 'react';

import ApplicationsHealthIndicatorBar from 'in-new-components/ApplicationHealthOverview/ApplicationsHealthIndicatorBar';

export default {
  title: 'Molecules|health/ApplicationsHealthIndicatorBar',
  component: ApplicationsHealthIndicatorBar
};

export function Indicator() {
  return <ApplicationsHealthIndicatorBar critical={5} warning={3} total={13} label="Health Status" />;
}
