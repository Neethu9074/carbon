import React from 'react';

import { getHealthColorBySeverity } from 'in-services/health';

export default function ClusterStatusLabel({ status }) {
  return (
    <span
      style={{
        color: getDependingOnStatus(status, '#00aa00', getHealthColorBySeverity(5), getHealthColorBySeverity(10), null)
      }}
    >
      {getDependingOnStatus(status, 'green', 'yellow', 'red', 'unknown')}
    </span>
  );
}

function getDependingOnStatus(status, ifGreen, ifYellow, ifRed, ifDefault) {
  switch (status) {
    case 0:
      return ifGreen;
    case 1:
      return ifYellow;
    case 2:
      return ifRed;
    default:
      return ifDefault;
  }
}
