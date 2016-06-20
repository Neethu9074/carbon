import {createStore} from 'in-stores/store';


const edges = createStore({
  name: 'processViewEdgesStore',
  initialValue: {}
});
export const edges$ = edges.observable;

export function addEdge(node) {
  edges.applyStateMutation(edgeMap => {
    edgeMap[node.id] = node;
    return edgeMap;
  });
}

export function removeEdge(node) {
  edges.applyStateMutation(edgeMap => {
    delete edgeMap[node.id];
    return edgeMap;
  });
}
