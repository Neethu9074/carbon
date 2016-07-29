export default function createCollection() {
  const objects = {};

  function add(id, object) {
    objects[id] = object;
  }

  function remove(id) {
    delete objects[id];
  }

  return {
    add,
    remove,
    objects
  };
}
