import {create} from 'reactive-observables';


const edges = {};
export const edges$ = create().emit(edges);

export function addEdge(edge) {
  edges[edge.id] = edge;
  edges$.emit(edges);
}

export function removeEdge(edge) {
  delete edges[edge.id];
  edges$.emit(edges);
}
