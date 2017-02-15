import {emptyMap} from 'in-services/fixedImmutables';
import unknownIconSvgPath from './unknownIconPath';


const iconSvgPathRegistry = {};

export function addIconSvgPathToRegistry(plugin, iconPath) {
  iconSvgPathRegistry[plugin] = iconPath;
}

const iconPathCallbacks = {};

export function addIconPathCallback(plugin, callback) {
  iconPathCallbacks[plugin] = callback;
}

export function getIconSvgPath(snapshotOrPlugin) {
  const match = iconSvgPathRegistry[getIconPath(snapshotOrPlugin)];
  return match ? match : unknownIconSvgPath;
}

export function getIconPath(snapshotOrPlugin) {
  const isSnapshot = typeof snapshotOrPlugin === 'object';
  if (isSnapshot) {
    const plugin = snapshotOrPlugin.get('plugin');
    const callback = iconPathCallbacks[plugin];
    return callback ? callback(snapshotOrPlugin) : plugin;
  }
  const callback = iconPathCallbacks[snapshotOrPlugin];
  return callback ? callback(emptyMap) : snapshotOrPlugin;
}

export function getAllSvgIconPaths() {
  return Object.keys(iconSvgPathRegistry).map(key => {
    return {
      id: key,
      path: iconSvgPathRegistry[key]
    };
  });
}
