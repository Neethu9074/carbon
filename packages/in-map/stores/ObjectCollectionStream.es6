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

  function get(id) {
    return collection.get(id);
  }

  return {
    add,
    get,
    remove,
    stream: objects$,
    objects: collection
  };
}
