import { create } from 'reactive-observables';

export default function createCollection() {
  const collection = new Map();

  const objects$ = create();
  objects$.emit(collection);

  function add(id, object) {
    collection.set(id, object);
    objects$.emit(collection);
  }

  function remove(id) {
    collection.delete(id);
    objects$.emit(collection);
  }

  function clear() {
    const items = collection.values();
    for (const item of items) {
      item.dispose();
    }

    collection.clear();
  }

  function get(id) {
    return collection.get(id);
  }

  return {
    add,
    get,
    remove,
    clear,
    stream: objects$,
    objects: collection
  };
}
