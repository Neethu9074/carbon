import { create } from 'reactive-observables';

import createObjectCollection from 'in-map/stores/ObjectCollection';

export default function createCollection() {
  const collection = createObjectCollection();

  const objects$ = create();
  objects$.emit(collection.objects);

  function add(id, object) {
    collection.add(id, object);
    objects$.emit(collection.objects);
  }

  function remove(id) {
    collection.remove(id);
    objects$.emit(collection.objects);
  }

  function get(id) {
    return collection.get(id);
  }

  return {
    add,
    get,
    remove,
    stream: objects$,
    objects: collection.objects
  };
}
