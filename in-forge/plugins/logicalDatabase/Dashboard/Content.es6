import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalClusterNodesTable from
  'in-components/DefaultLogicalClusterNodesTable/DefaultLogicalClusterNodesTable';
import DefaultLogicalKpiCharts from 'in-components/DefaultLogicalKpiCharts';
import DashboardSection from 'in-components/DashboardSection';
import {timeframeShape} from 'in-stores/timeline';


export default function LogicalDatabaseDashboard({snapshot, timeframe}) {
  return (
    <div>
      <DefaultLogicalKpiCharts snapshot={snapshot}
                               timeframe={timeframe} />

      <DashboardSection title='Runs on'>
        <DefaultLogicalClusterNodesTable snapshotId={snapshot.get('id')}
                                         timeframe={timeframe} />
      </DashboardSection>
    </div>
  );
}

LogicalDatabaseDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
