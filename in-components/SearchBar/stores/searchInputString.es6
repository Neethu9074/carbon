import {createStore} from 'in-stores/store';


const inputString = createStore({
  name: 'inputString',
  initialValue: ''
});

export const inputString$ = inputString.observable.distinct();

export function setInputString(newString) {
  inputString.applyStateMutation(() => newString);
}
