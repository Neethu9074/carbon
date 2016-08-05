import irpt from 'react-immutable-proptypes';
import React from 'react';

import {timeframeShape} from 'in-stores/timeline';


export default function JbossDataGridDashboard({}) {
  return (
    <div>
    </div>
  );
}

JbossDataGridDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
