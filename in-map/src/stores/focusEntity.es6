import {selectedSnapshotIdForHighlightingInMap} from 'in-map/src/mapStores';
import {createStore} from 'in-stores/store';


const focusEntityId = createStore({
  name: 'map/focusEntityId',
  initialValue: null
});
export const focusEntityId$ = focusEntityId.observable;


export function focusCurrentlyHighlightedEntity() {
  selectedSnapshotIdForHighlightingInMap.once(highlightedId => focusEntityId.applyStateMutation(() => highlightedId));
}

export function clearCurrentlyHighlightedEntity() {
  focusEntityId.applyStateMutation(() => null);
}
