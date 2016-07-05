import irpt from 'react-immutable-proptypes';
import React from 'react';

import FrontendsTable from 'in-forge/plugins/hAProxy/Dashboard/FrontendsTable';
import BackendsTable from 'in-forge/plugins/hAProxy/Dashboard/BackendsTable';
import DashboardNotification from 'in-components/DashboardNotification';
import {timeframeShape} from 'in-stores/timeline';


export default function HAProxyDashboard({snapshot, timeframe}) {
  const socketPath = snapshot.getIn(['data', 'socketPath']);
  if (!socketPath) {
    return (
      <DashboardNotification type='info'>
        HAProxy is not configured for socket access.
        Please configure 'stats socket' to point to a UNIX socket.
      </DashboardNotification>
    );
  }

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
