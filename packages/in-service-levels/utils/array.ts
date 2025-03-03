/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

/* disable prefer-default rule for utils files */
/* eslint-disable import/prefer-default-export */

export function removeAmbiguous<ITEM_TYPE extends { id: string }>(data: Array<ITEM_TYPE>): Array<ITEM_TYPE> {
  const uniqueSet = new Set<string>();
  return data.filter(item => !uniqueSet.has(item.id) && (uniqueSet.add(item.id), true));
}
