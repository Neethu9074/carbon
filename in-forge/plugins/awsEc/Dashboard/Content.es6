import React from 'react';

import AwsEcMemcachedDashboard from './AwsEcMemcachedDashboard';
import AwsEcGeneralDashboard from './AwsEcGeneralDashboard';
import AwsEcRedisDashboard from './AwsEcRedisDashboard';

export default function AwsEcDashboard({ snapshot, timeframe }) {
  const engine = snapshot.getIn(['data', 'cache_engine'], '');
  let engineDashboard = null;
  if (engine === 'redis') {
    engineDashboard = <AwsEcRedisDashboard snapshot={snapshot} timeframe={timeframe} />;
  } else if (engine === 'memcached') {
    engineDashboard = <AwsEcMemcachedDashboard snapshot={snapshot} timeframe={timeframe} />;
  }

  return (
    <div>
      <AwsEcGeneralDashboard snapshot={snapshot} timeframe={timeframe} />
      {engineDashboard}
    </div>
  );
}
