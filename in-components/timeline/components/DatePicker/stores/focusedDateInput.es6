import {createStore} from 'in-stores/store';


export const INPUTS = {
  NONE: null,
  FROM: 1,
  TO: 2,
  FOCUSED_MOMENT: 3
};

const focusedDateInput = createStore({
  name: 'in-components/Datepicker/stores/focusedDateInput',
  initialValue: INPUTS.NONE
});
export const focusedDateInput$ = focusedDateInput.observable;

export function focusInput(input) {
  focusedDateInput.mutateTo(input);
}

export function clearFocusedInput() {
  focusedDateInput.mutateTo(INPUTS.NONE);
}
