import {createStore} from 'in-stores/store';


const edges = createStore({
  name: 'processView/edges',
  initialValue: {}
});
export const edges$ = edges.observable;

export function addEdge(edge) {
  edges.applyStateMutation(edgeMap => {
    edgeMap[edge.id] = edge;
    return edgeMap;
  });
}

export function removeEdge(id) {
  edges.applyStateMutation(edgeMap => {
    delete edgeMap[id];
    return edgeMap;
  });
}
