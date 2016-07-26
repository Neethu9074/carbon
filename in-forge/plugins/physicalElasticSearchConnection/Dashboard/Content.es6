import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalConnectionDashboard from
  'in-sdk/components/dashboard/DefaultLogicalServiceDashboard/DefaultLogicalConnectionDashboard';
import {timeframeShape} from 'in-stores/timeline';


export default function PhysicalElasticSearchConnectionDashboard({snapshot, timeframe}) {
  return (
    <DefaultLogicalConnectionDashboard snapshot={snapshot}
                                       timeframe={timeframe} />
  );
}

PhysicalElasticSearchConnectionDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
