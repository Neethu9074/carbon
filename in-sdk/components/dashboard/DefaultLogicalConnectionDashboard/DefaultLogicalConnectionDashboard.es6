import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultKpiConnectionSection from
  'in-sdk/components/dashboard/DefaultLogicalConnectionDashboard/DefaultKpiConnectionSection';
import DefaultConnectionCharts from
  'in-sdk/components/dashboard/DefaultLogicalConnectionDashboard/DefaultConnectionCharts';
import ConnectedOutboundEntitiesTable from 'in-components/LogicalEntityTables/ConnectedOutboundEntitiesTable';
import ConnectedInboundEntitiesTable from 'in-components/LogicalEntityTables/ConnectedInboundEntitiesTable';
import {timeframeShape} from 'in-stores/timeline';

export default function DefaultLogicalConnectionDashboard({snapshot, timeframe}) {
  return (
    <div>
      <DefaultKpiConnectionSection snapshot={snapshot} />

      <DefaultConnectionCharts snapshot={snapshot}
                               timeframe={timeframe} />

      <ConnectedInboundEntitiesTable snapshot={snapshot}
                                     timeframe={timeframe} />

      <ConnectedOutboundEntitiesTable snapshot={snapshot}
                                      timeframe={timeframe} />
    </div>
  );
}

DefaultLogicalConnectionDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
