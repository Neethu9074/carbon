import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalConnectionDashboard from
  'in-sdk/components/dashboard/DefaultLogicalServiceDashboard/DefaultLogicalConnectionDashboard';
import {timeframeShape} from 'in-stores/timeline';


export default function LogicalJdbcConnectionDashboard({snapshot, timeframe}) {
  return (
    <DefaultLogicalConnectionDashboard snapshot={snapshot}
                                       timeframe={timeframe} />
  );
}

LogicalJdbcConnectionDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
