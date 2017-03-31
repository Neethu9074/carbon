import createObjectCollection from 'in-map/stores/ObjectCollection';

const factories = createObjectCollection();

export function addFactory(id, factory) {
  factories.add(id, factory);
  factory.init();
}

export function getFactory(id) {
  return factories.objects[id];
}

export function clear() {
  Object.keys(factories.objects).forEach(id => {
    factories.objects[id].dispose();
    factories.remove(id);
  });
}
