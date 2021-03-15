/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getColorBySeverity } from 'in-stores/events';

export default function StatusLabel({ status, insecure }) {
  const green = '#00aa00';
  const red = getColorBySeverity(10);
  if (status === 0 && insecure) {
    status = 3;
  }

  return (
    <span
      style={{
        color: getDependingOnStatus(status, green, red, 'inherit', null)
      }}
    >
      {getDependingOnStatus(status, 'ready', 'unavailable', 'ready (insecure)', 'unknown')}
    </span>
  );
}

function getDependingOnStatus(status, ifGreen, ifRed, ifInsecure, ifDefault) {
  switch (status) {
    case 0:
      return ifGreen;
    case 1:
      return ifRed;
    case 3:
      return ifInsecure;
    default:
      return ifDefault;
  }
}
