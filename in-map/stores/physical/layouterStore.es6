import {createStore} from 'in-stores/store';


const layouting = createStore({
  name: 'physical/layouter',
  initialValue: 'physical'
});
export const layouting$ = layouting.observable;

function toggle() {
  layouting.applyStateMutation(oldValue => {
    return oldValue === 'physical'
      ? 'pentagram'
      : 'physical';
  });
}

let wordsWritten = '';
const secretWord = 'dirtydoerte';
window.addEventListener('keydown', e => {
  wordsWritten += e.key;
  wordsWritten = wordsWritten.substr(-secretWord.length);
  if (wordsWritten === secretWord) {
    toggle();
  }
});
