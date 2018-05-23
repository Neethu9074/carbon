const registry = {};

export function getIconSvgPath(groupTypeId) {
  const config = registry[groupTypeId];
  if (config) {
    return config.iconPath;
  }
  return null;
}

export function getSingular(groupTypeId) {
  const config = registry[groupTypeId];
  if (config) {
    return config.singular;
  }
  return null;
}
