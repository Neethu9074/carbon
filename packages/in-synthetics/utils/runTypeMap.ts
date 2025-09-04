/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { runTypeOnDemandValue, runTypeOnDemandKey } from 'in-synthetics/utils/constants';

//key: Display type
//value: SyntheticType
const runTypeMap = new Map<string, string>([[runTypeOnDemandKey, runTypeOnDemandValue]]);

export function getDisplayRunType(runType: string) {
  for (let [key, value] of runTypeMap.entries()) {
    if (key === runType) {
      return value;
    } else {
      continue;
    }
  }
  //No display type found;
  return runType;
}
