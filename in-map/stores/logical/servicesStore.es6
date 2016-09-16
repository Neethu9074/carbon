import createCollection from 'in-map/stores/ObjectCollectionStream';
import {createStore} from 'in-stores/store';


const services = createCollection();
export default services;


const showKpi = createStore({
  name: 'logical/serviceSticky/kpis',
  initialValue: false
});
export const showKpi$ = showKpi.observable;

const showSticky = createStore({
  name: 'logical/serviceSticky/visibility',
  initialValue: false
});
export const showSticky$ = showSticky.observable;

export function setShowSticky(stickiesAreShown) {
  showSticky.applyStateMutation(() => stickiesAreShown);
}

export function setShowKpi(kpisAreShown) {
  showKpi.applyStateMutation(() => kpisAreShown);
}
