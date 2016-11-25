import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultCharts from 'in-sdk/components/dashboard/DefaultServiceInstanceDashboard/DefaultServiceInstanceCharts';
import DefaultKpiSection from 'in-sdk/components/dashboard/DefaultLogicalServiceDashboard/DefaultKpiSection';
import ClusterNodes from 'in-components/LogicalEntityTables/ClusterNodes';
import Connections from 'in-components/LogicalEntityTables/Connections';
import {timeframeShape} from 'in-stores/timeline';


export default function DefaultLogicalServiceDashboard({snapshot, timeframe}) {
  return (
    <div>
      <DefaultKpiSection snapshot={snapshot} />

      <DefaultCharts snapshot={snapshot}
                     timeframe={timeframe} />

      <ClusterNodes snapshotId={snapshot.get('id')}
                    timeframe={timeframe} />

      <Connections snapshotId={snapshot.get('id')}
                   timeframe={timeframe} />
    </div>
  );
}

DefaultLogicalServiceDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
