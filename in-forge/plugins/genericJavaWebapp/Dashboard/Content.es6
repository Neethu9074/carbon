import irpt from 'react-immutable-proptypes';
import React from 'react';

import {timeframeShape} from 'in-stores/timeline';


export default function GenericJavaWebAppDashboard() {
  return (
    <div/>
  );
}

GenericJavaWebAppDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
