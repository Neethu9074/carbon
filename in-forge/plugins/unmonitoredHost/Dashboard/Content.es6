import irpt from 'react-immutable-proptypes';
import React from 'react';

import {timeframeShape} from 'in-stores/timeline';


export default function UnmonitoredHostDashboard({}) {
  return <div/>;
}

UnmonitoredHostDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
