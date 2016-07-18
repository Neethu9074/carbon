import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalKpiCharts from 'in-components/DefaultLogicalKpiCharts';
import {timeframeShape} from 'in-stores/timeline';


export default function LogicalRabbitMqConnectionDashboard({snapshot, timeframe}) {
  return (
    <DefaultLogicalKpiCharts snapshot={snapshot}
                             timeframe={timeframe} />
  );
}

LogicalRabbitMqConnectionDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
