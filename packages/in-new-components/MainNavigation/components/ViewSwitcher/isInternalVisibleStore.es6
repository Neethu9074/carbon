import { internalMonitoringUnit } from 'in-services/featureFlags';
import { trySet, get } from 'in-services/localStorage';
import { isInstanaEmail } from 'in-stores/user';
import { createStore } from 'in-stores/store';

// Show Internal Feature
const localStorageKey = 'in-sif';
const showInternalFeatureForMillis = 1000 * 60 * 30;

const isInternalVisibleStore = createStore({
  name: 'internals',
  // Either the view is deliberately enabled or the user opened the internal views directly
  initialValue:
    isInstanaEmail &&
    (internalMonitoringUnit ||
      window.location.href.indexOf('/#/internal') != -1 ||
      hasInternalFeatureEnabledPerLocalStorage())
});
export const isInternalVisible$ = isInternalVisibleStore.observable;

let setAutoInvisibleHandle;
function setVisible() {
  isInternalVisibleStore.mutateTo(true);
  clearTimeout(setAutoInvisibleHandle);
  setAutoInvisibleHandle = setTimeout(() => isInternalVisibleStore.mutateTo(false), showInternalFeatureForMillis);
  trySet(localStorageKey, Date.now());
}

const timesClicked = [];
const numClicksNeeded = 10;
let currentIndex = 0;
export function click() {
  const timeClicked = Date.now();
  timesClicked[currentIndex++ % numClicksNeeded] = timeClicked;
  const temp = timesClicked.slice().sort((a, b) => a - b);
  const timeBetweenAllClicks = (temp[numClicksNeeded - 1] || Number.MAX_VALUE) - temp[0];

  if (timeBetweenAllClicks < 2000) {
    setVisible();
  }
}

function hasInternalFeatureEnabledPerLocalStorage() {
  const value = get(localStorageKey);
  if (!value) {
    return false;
  }

  return parseInt(value, 10) > Date.now() - showInternalFeatureForMillis;
}
