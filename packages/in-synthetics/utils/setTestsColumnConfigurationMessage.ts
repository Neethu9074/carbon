/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { tryGet, trySet } from 'in-services/localStorage';

const columnCustomizationlocalStorageKey = 'showTestsColumnCustomizationMessage';

export function addColumnCustomizationNotification() {
  if (tryGet(columnCustomizationlocalStorageKey) === null) {
    trySet(columnCustomizationlocalStorageKey, 'true');
  }
  return tryGet(columnCustomizationlocalStorageKey) === 'true';
}

export function removeColumncustomizationNotification() {
  trySet(columnCustomizationlocalStorageKey, 'false');
}
