import create from './abstractSelectableSnapshotStore';

const store = create('TODO REMOVE selected snapshot');
export const selectedSnapshotCoords = store.coordinates;
export const selectedSnapshot = store.fullSnapshot;

export function select() {
  throw new Error('TODO REMOVE');
}


export function clear() {
  throw new Error('TODO REMOVE');
}
