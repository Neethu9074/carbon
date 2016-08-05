import {selectedSnapshotIdForHighlightingInMap$} from 'in-map/stores/selectedMapSceneObjectStore';
import {createStore} from 'in-stores/store';


const focusEntityId = createStore({
  name: 'scene/focusEntityId',
  initialValue: null
});
export const focusEntityId$ = focusEntityId.observable.skipFirst();


export function focusCurrentlyHighlightedEntity() {
  selectedSnapshotIdForHighlightingInMap$.once(highlightedId => focusEntityId.applyStateMutation(() => highlightedId));
}
