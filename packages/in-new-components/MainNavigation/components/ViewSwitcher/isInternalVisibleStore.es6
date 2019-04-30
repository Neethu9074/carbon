import { internalMonitoringUnit } from 'in-services/featureFlags';
import { isInstanaEmail } from 'in-stores/user';
import { createStore } from 'in-stores/store';

const isInternalVisibleStore = createStore({
  name: 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore',
  // Either the view is deliberately enabled or the user opened the internal views directly
  initialValue: isInstanaEmail && (internalMonitoringUnit || window.location.href.indexOf('/#/internal') != -1)
});
export const isInternalVisible$ = isInternalVisibleStore.observable;

let setAutoInvisibleHandle;
function setVisible() {
  isInternalVisibleStore.mutateTo(true);

  clearTimeout(setAutoInvisibleHandle);
  setAutoInvisibleHandle = setTimeout(() => isInternalVisibleStore.mutateTo(false), 1000 * 60 * 30);
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
