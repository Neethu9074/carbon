import irpt from 'react-immutable-proptypes';
import React from 'react';

import DatabasesTable from 'in-forge/plugins/postgreSqlDatabase/Dashboard/DatabasesTable';
import DashboardNotification from 'in-components/DashboardNotification';
import {timeframeShape} from 'in-stores/timeline';


export default function PostgreSqlDashboard({snapshot, timeframe}) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return (
      <DashboardNotification type='info'>
        {sensorConnectionStatus}
      </DashboardNotification>);
  }
  return (
    <DatabasesTable snapshot={snapshot}
                    timeframe={timeframe}/>
  );
}

PostgreSqlDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
