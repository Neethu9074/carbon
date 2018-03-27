import React from 'react';

import AwsElbClassicDashboard from './AwsElbClassicDashboard';
import AwsElbAppDashboard from './AwsElbAppDashboard';
import AwsElbNetDashboard from './AwsElbNetDashboard';

export default function AwsElbDashboard({ snapshot, timeframe }) {
  const type = snapshot.getIn(['data', 'type'], '');
  let dashboard = null;
  if (type === 'application') {
    dashboard = <AwsElbAppDashboard snapshot={snapshot} timeframe={timeframe} />;
  } else if (type === 'network') {
    dashboard = <AwsElbNetDashboard snapshot={snapshot} timeframe={timeframe} />;
  } else {
    dashboard = <AwsElbClassicDashboard snapshot={snapshot} timeframe={timeframe} />;
  }
  return { dashboard };
}
