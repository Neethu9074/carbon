import irpt from 'react-immutable-proptypes';
import React from 'react';

import {timeframeShape} from 'in-stores/timeline';
import DashboardNotification from 'in-components/DashboardNotification';

export default function ActiveMQDashboard({snapshot}) {
  const version = snapshot.getIn(['data', 'version']);
  if (!version) {
    return (
      <DashboardNotification type='info'>
        Jmx is not enabled. You can enable it in activemq config by setting the broker property useJmx to true.
      </DashboardNotification>
    );
  }
  return (
    <div>
    </div>
  );
}

ActiveMQDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
