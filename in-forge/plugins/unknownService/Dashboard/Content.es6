import irpt from 'react-immutable-proptypes';
import React from 'react';

import {timeframeShape} from 'in-stores/timeline';


export default function UnknownServiceDashboard() {
  return (
    <div />
  );
}

UnknownServiceDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
