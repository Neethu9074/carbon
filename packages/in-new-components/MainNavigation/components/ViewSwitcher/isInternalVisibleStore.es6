import { createStore } from 'in-stores/store';

const isInternalVisibleStore = createStore({
  name: 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore',
  initialValue: false
});
const isInternalVisible$ = isInternalVisibleStore.observable;
export default isInternalVisible$;

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
