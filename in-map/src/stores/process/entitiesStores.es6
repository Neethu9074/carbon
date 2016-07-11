import {createStore} from 'in-stores/store';


function createNewEntityStore(id) {
  const entities = createStore({
    name: 'processView/' + id + 'Entities',
    initialValue: {}
  });

  let votings = {};

  return {
    voteUp,
    voteDown,
    entities$: entities.observable,
    clear
  };

  function add(_id, entity) {
    entities.applyStateMutation(entityMap => {
      entityMap[_id] = entity;
      return entityMap;
    });
  }

  function removeId(_id) {
    entities.applyStateMutation(entityMap => {
      delete entityMap[_id];
      return entityMap;
    });
  }

  function voteUp(_id, entity) {
    if (!votings[_id]) {
      votings[_id] = 0;
      add(_id, entity);
    }
    votings[_id]++;
  }

  function voteDown(_id) {
    if (!votings[_id]) {
      return;
    }

    votings[_id]--;
    if (votings[_id] <= 0) {
      delete votings[_id];
      removeId(_id);
    }
  }

  function clear() {
    votings = {};
    entities.applyStateMutation(() => {
      return {};
    });
  }
}

export const nodes = createNewEntityStore('node');
export const edges = createNewEntityStore('edges');
