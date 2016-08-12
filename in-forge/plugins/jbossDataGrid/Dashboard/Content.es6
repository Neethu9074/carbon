import React from 'react';

import CacheStatisticsTable from './CacheStatisticsTable.es6';
import ClusterUDPStatisticsTable from './ClusterUDPStatisticsTable.es6';

export default function JbossDataGridDashboard({snapshot, timeframe}) {
  return (
    <div>
      <CacheStatisticsTable snapshot={snapshot}
                   timeframe={timeframe}/>
      <ClusterUDPStatisticsTable snapshot={snapshot}
                            timeframe={timeframe}/>
    </div>
  );
}
