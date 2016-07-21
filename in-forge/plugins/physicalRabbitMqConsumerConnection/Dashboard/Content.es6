import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalKpiCharts from 'in-components/DefaultLogicalKpiCharts';
import {timeframeShape} from 'in-stores/timeline';


export default function PhysicalRabbitMqConsumerConnectionDashboard({snapshot, timeframe}) {
  return (
    <DefaultLogicalKpiCharts snapshot={snapshot}
                             timeframe={timeframe} />
  );
}

PhysicalRabbitMqConsumerConnectionDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
