'use strict';

// {
  // <pluginId: String>: [(snapshot) => <icon name: String>]
// }
const iconFinder = {};

export function addIconFinder(pluginId, finder) {
  if (!(pluginId in iconFinder)) {
    iconFinder[pluginId] = [];
  }

  iconFinder[pluginId].push(finder);
}

export function getIcon(snapshot, fallback='server') {
  const pluginId = snapshot.get('pluginId');

  const finder = iconFinder[pluginId];
  if (!finder) {
    return fallback;
  }

  for (let i = 0; i < finder.length; i++) {
    const icon = finder[i](snapshot);
    if (icon) {
      return icon;
    }
  }

  return fallback;
}
