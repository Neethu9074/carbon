import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalDashboard from
  'in-sdk/components/dashboard/DefaultLogicalServiceDashboard/DefaultLogicalServiceDashboard';
import {timeframeShape} from 'in-stores/timeline';


export default function LogicalDatabaseDashboard({snapshot, timeframe}) {
  return (
      <DefaultLogicalDashboard snapshot={snapshot}
                               timeframe={timeframe} />
  );
}

LogicalDatabaseDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
