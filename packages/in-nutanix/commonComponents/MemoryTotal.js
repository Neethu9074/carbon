/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';

import locals from 'in-nutanix/commonComponents/MemoryTotal.mless';

export function MemoryTotal({ count }) {
  return <div className={locals.flexWrapper}>{count >= 0 && <span>{bytesTwoDecimalPlaces(count)}</span>}</div>;
}
