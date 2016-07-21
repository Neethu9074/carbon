import {createStore} from 'in-stores/store';


const multiSelection = createStore({
  name: 'processView/multiSelection',
  initialValue: false
});
export const multiSelection$ = multiSelection.observable;


export function toggleMultiSelection() {
  multiSelection.applyStateMutation(isActive => {
    const newState = !isActive;
    if (!newState) {
      clearSelection();
    }
    return newState;
  });
}


const selectedEntities = createStore({
  name: 'processView/selectedEntities',
  initialValue: {}
});
export const selectedEntities$ = selectedEntities.observable;

export function selectEntity(id) {
  multiSelection$.once(isMultiSelectionActive => {
    if (!isMultiSelectionActive) {
      clearSelection();
      return;
    }

    selectedEntities.applyStateMutation(entities => {
      entities[id] ? delete entities[id] : entities[id] = true;
      return entities;
    });
  });
}

export function clearSelection() {
  selectedEntities.applyStateMutation(() => {
    return {};
  });
}
