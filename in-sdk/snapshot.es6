import * as constants from 'in-forge/constants';
import {getIconById} from 'in-sdk/iconRegistry';


const UNKNOWN_LABEL = 'Unknown';

// {
//   <plugin: String>: [(snapshot) => <label: String>]
// }
const labelFinder = {};

export function addLabelFinder(plugin, finder) {
  if (!(plugin in labelFinder)) {
    labelFinder[plugin] = [];
  }

  labelFinder[plugin].push(finder);
}

export function getLabel(snapshot, fallback) {
  if (!snapshot) {
    return fallback;
  }

  const plugin = snapshot.get('plugin');

  const finder = labelFinder[plugin];
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


export function getIcon(plugin) {
  if (typeof plugin === 'object') {
    plugin = getIconIdBySnapshot(plugin);
  }

  return getIconById(plugin);
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
