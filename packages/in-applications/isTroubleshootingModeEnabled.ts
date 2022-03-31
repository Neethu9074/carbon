/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create } from '@instana/observables';

import { tryGet, trySet } from 'in-services/localStorage';
import { minutes } from 'in-services/time';

const localStorageKey = 'in-tsm';
const enableTroubleshootingModeForMillis = minutes.toMillis(30);

const subject = create<boolean>().emit(isEnabledPerLocalStorage());
export const isTroubleshootingModeEnabled$ = subject.freeze();

let troubleshootingModeTimeout: NodeJS.Timeout;

export function setEnableTroubleshootingMode(enabled: boolean) {
  trySet(localStorageKey, String(enabled === true ? Date.now() : -1));
  subject.emit(enabled);

  // disable after N minutes
  clearTimeout(troubleshootingModeTimeout);
  if (enabled) {
    troubleshootingModeTimeout = setTimeout(
      () => setEnableTroubleshootingMode(false),
      enableTroubleshootingModeForMillis
    );
  }
}

function isEnabledPerLocalStorage() {
  const value = tryGet(localStorageKey);

  if (!value) {
    return false;
  }

  // check whether it expired
  return parseInt(value, 10) > Date.now() - enableTroubleshootingModeForMillis;
}
