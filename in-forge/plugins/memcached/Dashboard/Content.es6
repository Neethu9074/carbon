import irpt from 'react-immutable-proptypes';
import React from 'react';

import {timeframeShape} from 'in-stores/timeline';

export default function MemcachedDashboard({}) {
  return (
    <div />
  );
}

MemcachedDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
