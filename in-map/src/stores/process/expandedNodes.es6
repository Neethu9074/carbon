import {createStore} from 'in-stores/store';


const expandedNodes = createStore({
  name: 'processView/expandedNodes',
  initialValue: {}
});
export const expandedNodes$ = expandedNodes.observable;


export function expand(id) {
  expandedNodes.applyStateMutation(ids => {
    ids[id] = true;
    return ids;
  });
}

export function collapse(id) {
  expandedNodes.applyStateMutation(ids => {
    delete ids[id];
    return ids;
  });
}
