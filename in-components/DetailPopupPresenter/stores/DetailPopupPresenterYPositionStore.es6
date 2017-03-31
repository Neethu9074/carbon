import { createStore } from 'in-stores/store';

const position = createStore({
  name: 'DetailPopupPresenter/YPositionStore',
  initialValue: null
});
export const position$ = position.observable;

export function setPosition(_content) {
  position.applyStateMutation(() => _content);
}

export function clearPosition() {
  position.applyStateMutation(() => null);
}

const needsUpdate = createStore({
  name: 'DetailPopupPresenter/YPosition/needsUpdateStore',
  initialValue: null
});
export const needsUpdate$ = needsUpdate.observable;

export function positionNeedsUpdate() {
  needsUpdate.applyStateMutation(() => true);
}
