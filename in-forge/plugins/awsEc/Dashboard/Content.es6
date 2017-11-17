import React from 'react';

import AwsEcRedisDashboard from './AwsEcRedisDashboard';
import AwsEcMemcachedDashboard from './AwsEcMemcachedDashboard';

export default function AwsEcDashboard({ snapshot, timeframe }) {
  const engine = snapshot.get('cache_engine');

  if (engine === 'redis') {
    return <AwsEcRedisDashboard snapshot={snapshot} timeframe={timeframe} />;
  } else {
    return <AwsEcMemcachedDashboard snapshot={snapshot} timeframe={timeframe} />;
  }
}
