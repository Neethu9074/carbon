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
        color: getDependingOnStatus(status, '#00aa00', getColorBySeverity(10), null)
      }}
    >
      {getDependingOnStatus(status, 'OK', 'FAIL', 'UNKNOWN')}
    </span>
  );
}

function getDependingOnStatus(status, ifGreen, ifRed, ifDefault) {
  switch (status) {
    case 0:
      return ifGreen;
    case 1:
      return ifRed;
    default:
      return ifDefault;
  }
}
