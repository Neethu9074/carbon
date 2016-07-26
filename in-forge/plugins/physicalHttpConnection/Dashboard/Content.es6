import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalConnectionDashboard from
  'in-sdk/components/dashboard/DefaultLogicalServiceDashboard/DefaultLogicalConnectionDashboard';
import {timeframeShape} from 'in-stores/timeline';


export default function PhysicalHttpConnectionDashboard({snapshot, timeframe}) {
  return (
    <DefaultLogicalConnectionDashboard snapshot={snapshot}
                                       timeframe={timeframe} />
  );
}

PhysicalHttpConnectionDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
