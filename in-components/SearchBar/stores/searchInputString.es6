import {setFreeTextFilter} from 'in-stores/filtering';
import {createStore} from 'in-stores/store';


const inputString = createStore({
  name: 'SearchBar/inputString',
  initialValue: ''
});

export const inputString$ = inputString.observable.distinct();
inputString$.debounce(300).subscribe(setFreeTextFilter);

export function setInputString(newString) {
  inputString.applyStateMutation(() => newString);
}
