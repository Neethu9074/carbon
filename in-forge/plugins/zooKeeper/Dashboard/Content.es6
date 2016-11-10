import React from 'react';

import {emptyList} from 'in-services/fixedImmutables';

import ZKStandaloneDashboard from './ZKStandaloneDashboard';
import ZKReplicatedDashboard from './ZKReplicatedDashboard';

export default function ZooKeeperDashboard({snapshot, timeframe}) {
 const version = snapshot.getIn(['data', 'version']);
 const peerNames = snapshot.getIn(['data', 'peer_names'], emptyList);

 if (version) {
   return (
     <ZKStandaloneDashboard snapshot={snapshot}
                            timeframe={timeframe} />
   );
 } else if (peerNames.size > 0) {
     return (
       <ZKReplicatedDashboard snapshot={snapshot}
                              timeframe={timeframe} />
   );
 }
 return null;
}
