/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create } from '@instana/observables';

import { trySet, tryGet } from 'in-services/localStorage';
import { minutes } from 'in-services/time';

const localStorageKey = 'in-sit';
const showInternalTagsForMillis = minutes.toMillis(30);

const subject = create<boolean>().emit(isEnabledPerLocalStorage());
export const isShowInternalTagsEnabled$ = subject.freeze();

let hideInternalTagsHandle: any;
export function setShowInternalTags(enabled: boolean) {
  trySet(localStorageKey, String(enabled === true ? Date.now() : -1));
  subject.emit(enabled);

  // disable after N minutes
  clearTimeout(hideInternalTagsHandle);
  if (enabled) {
    hideInternalTagsHandle = setTimeout(() => setShowInternalTags(false), showInternalTagsForMillis);
  }
}

function isEnabledPerLocalStorage() {
  const value = tryGet(localStorageKey);

  if (!value) {
    return false;
  }

  // check whether it expired
  return parseInt(value, 10) > Date.now() - showInternalTagsForMillis;
}
