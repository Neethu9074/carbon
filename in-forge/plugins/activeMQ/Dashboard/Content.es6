import irpt from 'react-immutable-proptypes';
import React from 'react';

import {timeframeShape} from 'in-stores/timeline';

export default function ActiveMQDashboard({}) {
  return (
    <div>
    </div>
  );
}

ActiveMQDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
