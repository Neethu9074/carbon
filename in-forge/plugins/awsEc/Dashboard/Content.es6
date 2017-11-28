import React from 'react';

import AwsEcGeneralDashboard from './AwsEcGeneralDashboard';
import AwsEcRedisDashboard from './AwsEcRedisDashboard';
import AwsEcMemcachedDashboard from './AwsEcMemcachedDashboard';

export default function AwsEcDashboard({ snapshot, timeframe }) {
  const engine = snapshot.getIn(['data', 'cache_engine'], '');
  const engineDashboard =
    engine === 'redis' ? (
      <AwsEcRedisDashboard snapshot={snapshot} timeframe={timeframe} />
    ) : (
      <AwsEcMemcachedDashboard snapshot={snapshot} timeframe={timeframe} />
    );

  return (
    <div>
      <AwsEcGeneralDashboard snapshot={snapshot} timeframe={timeframe} />
      {engineDashboard}
    </div>
  );
}
