import React from 'react';

import AwsElbGeneralDashboard from './AwsElbGeneralDashboard';
import AwsElbAppDashboard from './AwsElbAppDashboard';
import AwsElbNetDashboard from './AwsElbNetDashboard';

export default function AwsElbDashboard({ snapshot, timeframe }) {
  const type = snapshot.getIn(['data', 'type'], '');
  let dashboard = null;
  if (type === 'application') {
    dashboard = <AwsElbAppDashboard snapshot={snapshot} timeframe={timeframe} />;
  } else if (type === 'network') {
    dashboard = <AwsElbNetDashboard snapshot={snapshot} timeframe={timeframe} />;
  }
  return (
    <div>
      <AwsElbGeneralDashboard snapshot={snapshot} timeframe={timeframe} />
      {dashboard}
    </div>
  );
}
