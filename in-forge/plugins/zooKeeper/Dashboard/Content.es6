import React from 'react';

import ZKStandaloneDashboard from './ZKStandaloneDashboard';
import ZKReplicatedDashboard from './ZKReplicatedDashboard';

export default function ZooKeeperDashboard({snapshot, timeframe}) {
 const version = snapshot.getIn(['data', 'version']);
 if (version) {
   return (
    <ZKStandaloneDashboard snapshot={snapshot} timeframe={timeframe} />
   );
 }

 return (
    <ZKReplicatedDashboard snapshot={snapshot} timeframe={timeframe} />
 );
}
