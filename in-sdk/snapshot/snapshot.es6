import Immutable from 'immutable';
import * as ro from 'reactive-observables';

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

  const pluginId = snapshot.get('pluginId');

  const finder = labelFinder[pluginId];
  if (!finder) {
    if (fallback) {
      return fallback;
    }
    return snapshot.get('steadyId');
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
  return snapshot.get('steadyId');
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

  const pluginId = snapshot.get('pluginId');

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
    pluginId = snapshot.get('pluginId');
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


// {
// (snapshot) => Observerable<Map<string, Set<snapshot>>>
// }
const wiredSnapshotFinder = {};

export function addWiredSnapshotFinder(pluginId, finder) {
  if (!(pluginId in wiredSnapshotFinder)) {
    wiredSnapshotFinder[pluginId] = [];
  }

  wiredSnapshotFinder[pluginId].push(finder);
}

const emptyObservable = ro.create({emitLatestOnSubscribe: true});
emptyObservable.emit(Immutable.Map({
  incoming: Immutable.Set(),
  outgoing: Immutable.Set()
}));

export function getWiredSnapshots(snapshot) {
  if (snapshot === null) {
    return emptyObservable;
  }

  const pluginId = snapshot.get('pluginId');

  const finder = wiredSnapshotFinder[pluginId];
  if (!finder) {
    return emptyObservable;
  }

  for (let i = 0; i < finder.length; i++) {
    const wiredSnapshots = finder[i](snapshot);
    if (wiredSnapshots) {
      return wiredSnapshots;
    }
  }

  return emptyObservable;
}


// {
// <pluginId: String>: [(snapshot) => <icon name: String>]
// }
const ipFinder = {};

export function addIpFinder(pluginId, finder) {
  if (!(pluginId in ipFinder)) {
    ipFinder[pluginId] = [];
  }

  ipFinder[pluginId].push(finder);
}

export function getIps(snapshot) {
  const pluginId = snapshot.get('pluginId');
  const finder = ipFinder[pluginId];

  if (!finder) {
    return [];
  }

  for (let i = 0; i < finder.length; i++) {
    const ips = finder[i](snapshot);
    if (ips) {
      return ips;
    }
  }

  return [];
}
