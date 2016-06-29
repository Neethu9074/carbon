import {createStore} from 'in-stores/store';


const position = createStore({
  name: 'DetailPopupPresenter/YPositionStore',
  initialValue: 0
});
export const position$ = position.observable;

export function setPosition(_content) {
  position.applyStateMutation(() => _content);
}

export function clearPosition() {
  position.applyStateMutation(() => null);
}
