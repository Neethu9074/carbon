import {createStore} from 'in-stores/store';
import {setFreeTextFilter} from 'in-stores/filtering';


const inputString = createStore({
  name: 'SearchBar/inputString',
  initialValue: ''
});

export const inputString$ = inputString.observable.distinct();
inputString$.debounce(300).subscribe(setFreeTextFilter);

export function setInputString(newString) {
  inputString.applyStateMutation(() => newString);
}
