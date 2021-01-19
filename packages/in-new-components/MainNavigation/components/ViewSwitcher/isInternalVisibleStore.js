/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { internalMonitoringUnit } from 'in-services/featureFlags';
import { trySet, get } from 'in-services/localStorage';
import { isInstanaEmail } from 'in-stores/user';
import { createStore } from 'in-stores/store';
import { minutes } from 'in-services/time';

// Show Internal Feature
const localStorageKey = 'in-sif';
const showInternalFeatureForMillis = minutes.toMillis(30);

const isInternalVisibleStore = createStore({
  name: 'internals',
  // Either the view is deliberately enabled or the user opened the internal views directly
  initialValue:
    internalMonitoringUnit ||
    (isInstanaEmail &&
      (window.location.href.indexOf('/#/internal') != -1 || hasInternalFeatureEnabledPerLocalStorage()))
});
export const isInternalVisible$ = isInternalVisibleStore.observable;

let setAutoInvisibleHandle;
function toggleVisible() {
  isInternalVisibleStore.applyStateMutation(oldContent => {
    // Make sure both the current setting is updated (toggled) but also persisted in the local-store
    if (oldContent === true) {
      trySet(localStorageKey, -1);
      return false;
    } else {
      trySet(localStorageKey, Date.now());
      return true;
    }
  });

  clearTimeout(setAutoInvisibleHandle);
  setAutoInvisibleHandle = setTimeout(() => isInternalVisibleStore.mutateTo(false), showInternalFeatureForMillis);
}

const numClicksNeeded = 10;
let timesClicked = [];
let currentIndex = 0;
export function click() {
  const timeClicked = Date.now();
  timesClicked[currentIndex++ % numClicksNeeded] = timeClicked;
  const temp = timesClicked.slice().sort((a, b) => a - b);
  const timeBetweenAllClicks = (temp[numClicksNeeded - 1] || Number.MAX_VALUE) - temp[0];

  if (isInstanaEmail && timeBetweenAllClicks < 2000) {
    timesClicked = []; // Reset to start next session of 10 clicks
    toggleVisible();
  }
}

function hasInternalFeatureEnabledPerLocalStorage() {
  const value = get(localStorageKey);
  if (!value) {
    return false;
  }

  return parseInt(value, 10) > Date.now() - showInternalFeatureForMillis;
}
