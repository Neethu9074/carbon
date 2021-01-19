/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { getColorBySeverity } from 'in-stores/events';

export default function ClusterStatusLabel({ status }) {
  return (
    <span
      style={{
        color: getDependingOnStatus(status, '#00aa00', getColorBySeverity(5), getColorBySeverity(10), null)
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
