import {createStore} from 'in-stores/store';


const activeGhosts = createStore({
  name: 'processview/activeGhostsStore',
  initialValue: {}
});
export const activeGhosts$ = activeGhosts.observable;

export function addGhost(id, ghost) {
  activeGhosts.applyStateMutation(ghostsMap => {
    ghostsMap[id] = ghost;
    return ghostsMap;
  });
}

export function removeGhost(id) {
  activeGhosts.applyStateMutation(ghostsMap => {
    delete ghostsMap[id];
    return ghostsMap;
  });
}
