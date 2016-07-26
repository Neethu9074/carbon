import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultKpiConnectionSection from
  'in-sdk/components/dashboard/DefaultLogicalServiceDashboard/DefaultKpiConnectionSection';
import DefaultConnectionCharts from
  'in-sdk/components/dashboard/DefaultLogicalServiceDashboard/DefaultConnectionCharts';
import {timeframeShape} from 'in-stores/timeline';


export default function DefaultLogicalConnectionDashboard({snapshot, timeframe}) {
  return (
    <div>
      <DefaultKpiConnectionSection snapshot={snapshot}/>

      <DefaultConnectionCharts snapshot={snapshot}
                     timeframe={timeframe} />
    </div>
  );
}

DefaultLogicalConnectionDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
