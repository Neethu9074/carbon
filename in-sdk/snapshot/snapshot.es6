import * as constants from 'in-forge/constants';
import {getIconById} from 'in-sdk/iconRegistry';


const UNKNOWN_LABEL = 'Unknown';

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
    return UNKNOWN_LABEL;
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
  return UNKNOWN_LABEL;
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


export function getIcon(pluginId) {
  if (typeof pluginId === 'object') {
    pluginId = getIconIdBySnapshot(pluginId);
  }

  return getIconById(pluginId);
}

export function getIconIdBySnapshot(snapshot) {
  let type = snapshot.get('plugin');

  const osPlugin = constants.plugins.os;
  if (type === osPlugin) {
    const os = snapshot.getIn(['data', 'os.name']);
    type = osPlugin + '_linux'; // linux as default

    if (os) {
      if (os.match(/linux/i)) {
        type = osPlugin + '_linux';
      } else if (os.match(/windows/i)) {
        type = osPlugin + '_windows';
      } else if (os.match(/mac/i)) {
        type = osPlugin + '_apple';
      }
    }
  }
  return type;
}
