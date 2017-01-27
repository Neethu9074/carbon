import {createStore} from 'in-stores/store';


const currentDateFn = createStore({
  name: 'timeline/datepicker/currentDateFn',
  initialValue: null
});
export const currentDateFn$ = currentDateFn.observable;


export function toggleDateFn(fn) {
  currentDateFn.applyStateMutation(oldFn => oldFn === fn ? null : fn);
}
