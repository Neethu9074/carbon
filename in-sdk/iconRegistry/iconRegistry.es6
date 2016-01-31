const iconRegistry = {};

export function addIconToRegistry(icon) {
  iconRegistry[icon.id] = icon;
}

export function addIconsToRegistry(icons) {
  icons.forEach(icon => addIconToRegistry(icon));
}

export function getIconById(id) {
  const match = iconRegistry[id];
  if (match) {
    return match.image;
  }
}

export function getAllIcons() {
  return Object.keys(iconRegistry).map(key => iconRegistry[key]);
}
