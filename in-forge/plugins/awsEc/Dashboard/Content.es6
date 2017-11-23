import React from 'react';

import AwsEcGeneralDashboard from './AwsEcGeneralDashboard';
import AwsEcRedisDashboard from './AwsEcRedisDashboard';
import AwsEcMemcachedDashboard from './AwsEcMemcachedDashboard';

export default function AwsEcDashboard({ snapshot, timeframe }) {
  const engine = snapshot.getIn(['data', 'cache_engine'], '');

  return (
    <div>
      <AwsEcGeneralDashboard snapshot={snapshot} timeframe={timeframe} />
      {engine === 'redis' ? (
        <AwsEcRedisDashboard snapshot={snapshot} timeframe={timeframe} />
      ) : (
        <AwsEcMemcachedDashboard snapshot={snapshot} timeframe={timeframe} />
      )}
    </div>
  );
}
