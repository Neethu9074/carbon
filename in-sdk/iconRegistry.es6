import unknownIconSvgPath from './unknownIconPath';


const iconSvgPathRegistry = {};

export function addIconSvgPathToRegistry(plugin, iconPath) {
  iconSvgPathRegistry[plugin] = iconPath;
}

const iconPathCallbacks = {};

export function addIconPathCallback(plugin, callback) {
  iconPathCallbacks[plugin] = callback;
}

export function getIconSvgPath(snapshot) {
  const match = iconSvgPathRegistry[getIconPath(snapshot)];
  return match ? match : unknownIconSvgPath;
}

export function getIconPath(snapshot) {
  const plugin = snapshot.get('plugin');
  const callback = iconPathCallbacks[plugin];
  return callback ? callback(snapshot) : plugin;
}

export function getAllSvgIconPaths() {
  return Object.keys(iconSvgPathRegistry).map(key => {
    return {
      id: key,
      path: iconSvgPathRegistry[key]
    };
  });
}
