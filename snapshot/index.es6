'use strict';

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
  const pluginId = snapshot.get('pluginId');

  const finder = labelFinder[pluginId];
  if (!finder) {
    if (fallback) {
      return fallback;
    } else {
      return snapshot.get('steadyId');
    }
  }

  for (let i = 0; i < finder.length; i++) {
    const icon = finder[i](snapshot);
    if (icon) {
      return icon;
    }
  }

  if (fallback) {
    return fallback;
  } else {
    return snapshot.get('steadyId');
  }
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


const connectionFinder = {};

export function addConnectionFinder(pluginId, finder) {
  if (!(pluginId in connectionFinder)) {
    connectionFinder[pluginId] = [];
  }

  connectionFinder[pluginId].push(finder);
}

export function getConnected(snapshot, fallback=[]) {
  const pluginId = snapshot.get('pluginId');

  const finder = connectionFinder[pluginId];
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
