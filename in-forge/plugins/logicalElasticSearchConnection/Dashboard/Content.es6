import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalKpiCharts from 'in-components/DefaultLogicalKpiCharts';
import {timeframeShape} from 'in-stores/timeline';


export default function LogicalElasticSearchConnectionDashboard({snapshot, timeframe}) {
  return (
    <DefaultLogicalKpiCharts snapshot={snapshot}
                             timeframe={timeframe} />
  );
}

LogicalElasticSearchConnectionDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
