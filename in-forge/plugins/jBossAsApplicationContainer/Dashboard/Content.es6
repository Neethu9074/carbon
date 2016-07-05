import irpt from 'react-immutable-proptypes';
import React from 'react';

import DeploymentsTable from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/DeploymentsTable';
import ConnectorsTable from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/ConnectorsTable';
import {timeframeShape} from 'in-stores/timeline';


export default function JBossAsDashboard({snapshot, timeframe}) {
  return (
    <div>
      <DeploymentsTable snapshot={snapshot}
                        timeframe={timeframe} />

      <ConnectorsTable snapshot={snapshot}
                       timeframe={timeframe} />
    </div>
  );
}

JBossAsDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
