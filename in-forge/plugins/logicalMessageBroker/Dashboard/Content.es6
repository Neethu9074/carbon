import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalDashboard from
  'in-sdk/components/dashboard/DefaultLogicalServiceDashboard/DefaultLogicalServiceDashboard';
import {timeframeShape} from 'in-stores/timeline';


export default function LogicalMessageBrokerDashboard({snapshot, timeframe}) {
  return (
      <DefaultLogicalDashboard snapshot={snapshot}
                               timeframe={timeframe} />
  );
}

LogicalMessageBrokerDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
