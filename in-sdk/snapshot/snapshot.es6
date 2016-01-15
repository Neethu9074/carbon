// {
//   <pluginId: String>: [(snapshot) => <label: String>]
// }
const labelFinder = {};

export function addLabelFinder(pluginId, finder) {
  if (!(pluginId in labelFinder)) {
    labelFinder[pluginId] = [];
  }

  labelFinder[pluginId].push(finder);
}

export function getLabel(snapshot, fallback) {
  if (!snapshot) {
    return fallback;
  }

  const pluginId = snapshot.get('plugin');

  const finder = labelFinder[pluginId];
  if (!finder) {
    if (fallback) {
      return fallback;
    }
    return snapshot.get('id');
  }

  for (let i = 0; i < finder.length; i++) {
    const icon = finder[i](snapshot);
    if (icon) {
      return icon;
    }
  }

  if (fallback) {
    return fallback;
  }
  return snapshot.get('id');
}


// {
//   <pluginId: String>: [(snapshot) => <label: String>]
// }
const longLabelFinder = {};

export function addLongLabelFinder(pluginId, finder) {
  if (!(pluginId in longLabelFinder)) {
    longLabelFinder[pluginId] = [];
  }

  longLabelFinder[pluginId].push(finder);
}

export function getLongLabel(snapshot, fallback) {
  if (!snapshot) {
    return fallback;
  }

  const pluginId = snapshot.get('plugin');

  const finder = longLabelFinder[pluginId];
  if (!finder) {
    if (fallback) {
      return fallback;
    }
    return undefined;
  }

  for (let i = 0; i < finder.length; i++) {
    const icon = finder[i](snapshot);
    if (icon) {
      return icon;
    }
  }

  if (fallback) {
    return fallback;
  }
  return undefined;
}


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

export function getIcon(pluginId) {
  let snapshot;
  if (typeof pluginId === 'object') {
    snapshot = pluginId;
    pluginId = snapshot.get('plugin');
  }

  const finder = iconFinder[pluginId];
  if (!finder) {
    return undefined;
  }

  for (let i = 0; i < finder.length; i++) {
    const icon = finder[i](snapshot);
    if (icon) {
      return icon;
    }
  }

  return undefined;
}
