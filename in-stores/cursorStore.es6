import {createStore} from 'in-stores/store';


export const CURSOR_TYPES = {
  HORIZONTAL_MOVE: 'ew-resize',
  POINTER: 'pointer',
  DEFAULT: ''
};

const cursor = createStore({
  name: 'cursorStore',
  initialValue: CURSOR_TYPES.DEFAULT
});

export function setCursor(cursorType) {
  cursor.applyStateMutation(() => cursorType);
}

cursor.observable
  .distinct()
  .subscribe(cursorType => document.body.style.cursor = cursorType);
