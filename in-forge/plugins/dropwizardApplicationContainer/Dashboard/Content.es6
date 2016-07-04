import irpt from 'react-immutable-proptypes';
import React from 'react';

import CountersTable from 'in-forge/plugins/dropwizardApplicationContainer/Dashboard/CountersTable';
import GaugesTable from 'in-forge/plugins/dropwizardApplicationContainer/Dashboard/GaugesTable';
import MetersTable from 'in-forge/plugins/dropwizardApplicationContainer/Dashboard/MetersTable';
import {timeframeShape} from 'in-stores/timeline';


export default function DropwizardDashboard({snapshot, timeframe}) {
  return (
    <div>
      <GaugesTable snapshot={snapshot} timeframe={timeframe} />
      <CountersTable snapshot={snapshot} timeframe={timeframe} />
      <MetersTable snapshot={snapshot} timeframe={timeframe} />
    </div>
  );
}

DropwizardDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
