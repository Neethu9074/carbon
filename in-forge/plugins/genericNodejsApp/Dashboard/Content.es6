import irpt from 'react-immutable-proptypes';
import React from 'react';

import HttpServersTable from 'in-forge/plugins/genericNodejsApp/Dashboard/HttpServersTable';
import {timeframeShape} from 'in-stores/timeline';


export default function NodejsDashboard({snapshot, timeframe}) {
  return (
    <HttpServersTable snapshot={snapshot}
                      timeframe={timeframe} />
  );
}

NodejsDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
