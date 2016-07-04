import irpt from 'react-immutable-proptypes';
import React from 'react';

import FrontendsTable from 'in-forge/plugins/hAProxy/Dashboard/FrontendsTable';
import BackendsTable from 'in-forge/plugins/hAProxy/Dashboard/BackendsTable';
import {timeframeShape} from 'in-stores/timeline';


export default function HAProxyDashboard({snapshot, timeframe}) {
  return (
    <div>
      <FrontendsTable snapshot={snapshot}
                      timeframe={timeframe} />
      <BackendsTable snapshot={snapshot}
                     timeframe={timeframe} />
    </div>
  );
}

HAProxyDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
