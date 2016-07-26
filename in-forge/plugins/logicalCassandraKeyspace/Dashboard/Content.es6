import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalDashboard from
  'in-sdk/components/dashboard/DefaultLogicalServiceDashboard/DefaultLogicalServiceDashboard';
import {timeframeShape} from 'in-stores/timeline';


export default function LogicalCassandraKeyspaceDashboard({snapshot, timeframe}) {
  return (
      <DefaultLogicalDashboard snapshot={snapshot}
                               timeframe={timeframe} />
  );
}

LogicalCassandraKeyspaceDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
