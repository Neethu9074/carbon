import irpt from 'react-immutable-proptypes';
import React from 'react';

import DatabasesTable from 'in-forge/plugins/postgreSqlDatabase/Dashboard/DatabasesTable';
import {timeframeShape} from 'in-stores/timeline';


export default function PostgreSqlDashboard({snapshot, timeframe}) {
  return (
    <DatabasesTable snapshot={snapshot}
                    timeframe={timeframe} />
  );
}

PostgreSqlDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
