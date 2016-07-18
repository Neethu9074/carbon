import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalKpiCharts from 'in-components/DefaultLogicalKpiCharts';
import ClusterNodes from 'in-components/LogicalEntityTables/ClusterNodes';
import Connections from 'in-components/LogicalEntityTables/Connections';
import {timeframeShape} from 'in-stores/timeline';


export default function LogicalMessageBrokerDashboard({snapshot, timeframe}) {
  return (
    <div>
      <DefaultLogicalKpiCharts snapshot={snapshot}
                               timeframe={timeframe} />

      <ClusterNodes snapshotId={snapshot.get('id')}
                    timeframe={timeframe} />

      <Connections snapshotId={snapshot.get('id')}
                   timeframe={timeframe} />
    </div>
  );
}

LogicalMessageBrokerDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
