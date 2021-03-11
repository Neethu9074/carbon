/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { trySet, tryGet } from 'in-services/localStorage';
import { createStore } from 'in-stores/store';
import { minutes } from 'in-services/time';

const localStorageKey = 'in-sit';
const showInternalTagsForMillis = minutes.toMillis(30);

const isShowInternalTagsEnabled = createStore({
  name: 'isShowInternalTagsEnabled',
  initialValue: hasShowInternalTagsEnabledPerLocalStorage()
});
export const isShowInternalTagsEnabled$ = isShowInternalTagsEnabled.observable;

let hideInternalTagsHandle;
export function enableShowInternalTags(enabled) {
  isShowInternalTagsEnabled.applyStateMutation(() => {
    // Update store + local storage
    if (enabled === true) {
      trySet(localStorageKey, Date.now());
    } else {
      trySet(localStorageKey, -1);
    }
    return enabled;
  });

  // disable after N minutes
  clearTimeout(hideInternalTagsHandle);
  hideInternalTagsHandle = setTimeout(() => isShowInternalTagsEnabled.mutateTo(false), showInternalTagsForMillis);
}

function hasShowInternalTagsEnabledPerLocalStorage() {
  const value = tryGet(localStorageKey);

  if (!value) {
    return false;
  }

  // check whether it expired
  return parseInt(value, 10) > Date.now() - showInternalTagsForMillis;
}
