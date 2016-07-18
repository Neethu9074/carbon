import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalKpiCharts from 'in-components/DefaultLogicalKpiCharts';
import {timeframeShape} from 'in-stores/timeline';


export default function LogicalElasticSearchIndexDashboard({snapshot, timeframe}) {
  return (
    <DefaultLogicalKpiCharts snapshot={snapshot}
                             timeframe={timeframe} />
  );
}

LogicalElasticSearchIndexDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
