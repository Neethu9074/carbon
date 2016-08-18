import {create} from 'reactive-observables';

import createObjectCollection from 'in-map/stores/ObjectCollection';


export default function createCollection() {
  const objects$ = create();
  const collection = createObjectCollection();

  function add(id, object) {
    collection.add(id, object);
    objects$.emit(collection.objects);
  }

  function remove(id) {
    collection.remove(id);
    objects$.emit(collection.objects);
  }

  return {
    add,
    remove,
    stream: objects$,
    objects: collection.objects
  };
}
