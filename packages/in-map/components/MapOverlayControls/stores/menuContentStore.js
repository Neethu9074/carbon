import { createStore } from 'in-stores/store';

const menuContent = createStore({
  name: 'Controls/menuContentStore',
  initialValue: null
});
export const menuContent$ = menuContent.observable;

export function toggleContent(newContent) {
  menuContent.applyStateMutation(oldContent => {
    return oldContent && oldContent.id === newContent.id ? null : newContent;
  });
}

export function closeCurrentMenu() {
  menuContent.mutateTo(null);
}
