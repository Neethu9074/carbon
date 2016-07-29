import {create} from 'reactive-observables';

import createObjectCollection from 'in-map/stores/ObjectColletion';


export default function createCollection() {
  const objects$ = create();
  const objects = createObjectCollection();

  function add(id, object) {
    objects.add(id, object);
    objects$.emit(objects);
  }

  function remove(id) {
    objects.remove(id);
    objects$.emit(objects);
  }

  return {
    add,
    remove,
    stream: objects$,
    objects: objects.object
  };
}
