/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { getColorBySeverity } from 'in-stores/events';

export default function StatusLabel({ status, desiredState }) {
  return (
    <span
      style={{
        color: getDependingOnStatus(status, '#00aa00', getColorBySeverity(10), desiredState)
      }}
    >
      {status}
    </span>
  );
}

function getDependingOnStatus(status, ifGreen, ifRed, desiredState) {
  if (status === desiredState) {
    return ifGreen;
  } else {
    return ifRed;
  }
}
