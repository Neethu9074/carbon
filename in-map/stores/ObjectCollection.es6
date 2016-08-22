export default function createCollection() {
  const objects = {};

  function add(id, object = true) {
    objects[id] = object;
  }

  function remove(id) {
    delete objects[id];
  }

  function get(id) {
    return objects[id];
  }

  return {
    add,
    remove,
    get,
    objects
  };
}
