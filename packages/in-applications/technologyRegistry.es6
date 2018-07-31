import { get } from 'lodash';

import { compareIgnoreCase } from 'in-services/util/string';

const registry = {};
export default registry;

export function addToRegistry({ id, label, icon }) {
  registry[id] = {
    label,
    icon
  };
}

export function getIconSvgPath(id) {
  return get(registry, [id, 'icon']);
}

export function getLabel(id) {
  return get(registry, [id, 'label']);
}

export function getTechnologyComboBoxItems(restrict = null) {
  return Object.keys(registry)
    .filter(key => restrict == null || restrict.indexOf(key) !== -1)
    .map(key => ({ value: key, label: registry[key].label }))
    .sort((a, b) => compareIgnoreCase(a.label, b.label));
}
