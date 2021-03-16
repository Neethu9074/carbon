/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getColorBySeverity } from 'in-stores/events';

export default function InstanceStatusLabel({ status }) {
  return (
    <span
      style={{
        color: getDependingOnStatus(status, '#00aa00', getColorBySeverity(5), getColorBySeverity(10), null)
      }}
    >
      {status}
    </span>
  );
}

function getDependingOnStatus(status, ifGreen, ifYellow, ifRed, ifDefault) {
  switch (status) {
    case 'RUNNING':
      return ifGreen;
    case 'PENDING_CREATE':
      return ifYellow;
    case 'SUSPENDED':
      return ifRed;
    case 'MAINTENANCE':
      return ifRed;
    default:
      return ifDefault;
  }
}
