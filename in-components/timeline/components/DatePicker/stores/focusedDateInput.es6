import {createStore} from 'in-stores/store';


const focusedDateInput = createStore({
  name: 'in-components/Datepicker/stores/focusedDateInput',
  initialValue: null
});
export const focusedDateInput$ = focusedDateInput.observable;

export function focusInput(id) {
  focusedDateInput.mutateTo(id);
}

export function clearFocusedInput() {
  focusedDateInput.mutateTo(null);
}
