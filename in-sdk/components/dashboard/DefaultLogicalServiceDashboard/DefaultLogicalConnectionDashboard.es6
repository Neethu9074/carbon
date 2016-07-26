import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultKpiSection from 'in-sdk/components/dashboard/DefaultLogicalServiceDashboard/DefaultKpiSection';
import DefaultCharts from 'in-sdk/components/dashboard/DefaultLogicalServiceDashboard/DefaultCharts';
import {timeframeShape} from 'in-stores/timeline';


export default function DefaultLogicalConnectionDashboard({snapshot, timeframe}) {
  return (
    <div>
      <DefaultKpiSection snapshot={snapshot}/>

      <DefaultCharts snapshot={snapshot}
                     timeframe={timeframe} />
    </div>
  );
}

DefaultLogicalConnectionDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
