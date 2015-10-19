import {alwaysNull} from '../fixedStreams';
import {createStore} from './store';
import {isIdEqual, getFullSnapshot} from '../snapshots';

export default function createSelectableSnapshotStore(name) {

  const store = createStore({
    name,
    initialValue: null
  });

  const coordinates = store.observable.distinct();
  const fullSnapshot = coordinates.flatMap(coords => {
      if (coords == null) {
        return alwaysNull;
      }
      return getFullSnapshot(coords);
    }).freeze();

  return {
    coordinates,
    fullSnapshot,
    select,
    clear
  };

  function select(snapshotCoords) {
    store.applyStateMutation(previousCoords => {
      if (isIdEqual(previousCoords, snapshotCoords)) {
        return previousCoords;
      }
      return snapshotCoords;
    });
  }

  function clear() {
    store.applyStateMutation(() => null);
  }

}
