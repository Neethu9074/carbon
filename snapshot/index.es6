'use strict';

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
emptyObservable.emit([]);

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
