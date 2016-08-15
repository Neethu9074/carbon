import React from 'react';

import CacheLatencyThroughputTable from './CacheLatencyThroughputTable.es6';
import CacheHitsAndMissesTable from './CacheHitsAndMissesTable.es6';
import CacheOtherStatsTable from './CacheOtherStatsTable.es6';
import JgroupsDefaultThreadPoolTable from './JgroupsDefaultThreadPoolTable.es6';
import JgroupsOOBThreadPoolTable from './JgroupsOOBThreadPoolTable.es6';
import JgroupsTimerThreadPoolTable from './JgroupsTimerThreadPoolTable.es6';

export default function JbossDataGridDashboard({snapshot, timeframe}) {
  return (
    <div>
      <CacheLatencyThroughputTable snapshot={snapshot}
                                 timeframe={timeframe}/>
      <CacheHitsAndMissesTable snapshot={snapshot}
                                   timeframe={timeframe}/>
      <CacheOtherStatsTable snapshot={snapshot}
                                   timeframe={timeframe}/>
      <JgroupsDefaultThreadPoolTable snapshot={snapshot}
                            timeframe={timeframe}/>
      <JgroupsOOBThreadPoolTable snapshot={snapshot}
                                     timeframe={timeframe}/>
      <JgroupsTimerThreadPoolTable snapshot={snapshot}
                                     timeframe={timeframe}/>
    </div>
  );
}
