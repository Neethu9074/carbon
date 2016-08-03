import {createStore} from 'in-stores/store';


const maxPower = createStore({
  name: 'physical/power',
  initialValue: 1
});

export const maxPower$ = maxPower.observable;

export function setPower(newPower) {
  maxPower.applyStateMutation(() => newPower);
}
