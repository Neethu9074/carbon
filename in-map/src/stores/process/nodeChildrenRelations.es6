import {createStore} from 'in-stores/store';


const relations = createStore({
  name: 'processView/nodeChildrenRelations',
  initialValue: {}
});
export const relations$ = relations.observable;

export function addRelation(id, childIds) {
  relations.applyStateMutation(ralationsMap => {
    ralationsMap[id] = childIds;
    return ralationsMap;
  });
}

export function removeRelation(id) {
  relations.applyStateMutation(ralationsMap => {
    delete ralationsMap[id];
    return ralationsMap;
  });
}
