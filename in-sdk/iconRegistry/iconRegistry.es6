import unknownIconPath from './unknown_icon.svg';

const iconRegistry = {};

export function addIconToRegistry(icon) {
  iconRegistry[icon.id] = icon;
}

addIconToRegistry({
  id: 'unknown',
  image: unknownIconPath
});

export function addIconsToRegistry(icons) {
  icons.forEach(icon => addIconToRegistry(icon));
}

export function getIconById(id) {
  const match = iconRegistry[id];
  if (match) {
    return match.image;
  }
  return getIconById('unknown');
}

export function getAllIcons() {
  return Object.keys(iconRegistry).map(key => iconRegistry[key]);
}
