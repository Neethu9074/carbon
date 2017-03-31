import React from 'react';

import { theme } from 'in-services/theme';

export default function ClusterStatusLabel({ status }) {
  return (
    <span style={{ color: getDependingOnStatus(status, '#00aa00', theme.health[5], theme.health[10], null) }}>
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
