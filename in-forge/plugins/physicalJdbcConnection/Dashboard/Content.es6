import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalKpiCharts from 'in-components/DefaultLogicalKpiCharts';
import {timeframeShape} from 'in-stores/timeline';


export default function PhysicalJdbcConnectionDashboard({snapshot, timeframe}) {
  return (
    <DefaultLogicalKpiCharts snapshot={snapshot}
                             timeframe={timeframe} />
  );
}

PhysicalJdbcConnectionDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
