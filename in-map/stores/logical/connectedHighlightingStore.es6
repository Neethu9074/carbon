import {emptyObject} from 'in-services/fixedObjects';
import {createStore} from 'in-stores/store';


const connectedHighlightedIds = createStore({
  name: 'logical/connectedHighlightedIds',
  initialValue: emptyObject
});

export const connectedHighlightedIds$ = connectedHighlightedIds.observable;


export function setIds(ids) {
  connectedHighlightedIds.mutateTo(ids ? ids : emptyObject);
}

export function clearIds() {
  setIds(null);
}
