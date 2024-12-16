/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

/* disable prefer-default rule for utils files */
/* eslint-disable import/prefer-default-export */

export function removeAmbiguous<ITEM_TYPE>(sloData: Array<ITEM_TYPE>): Array<ITEM_TYPE> {
  const uniqueSet = new Set(sloData.map(slo => JSON.stringify(slo)));
  return Array.from(uniqueSet).map(sloJson => JSON.parse(sloJson) as ITEM_TYPE);
}
