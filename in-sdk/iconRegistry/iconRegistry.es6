const iconRegistry = [];

export function addIconToRegistry(icon) {
  iconRegistry.push({
    id: icon.id,
    image: icon.image
  });
}

export function addIconsToRegistry(icons) {
  icons.forEach(icon => addIconToRegistry(icon));
}

export function getIconById(id) {
  for (let i = 0; i < iconRegistry.length; i++) {
    if (iconRegistry[i].id === id) {
      return iconRegistry[i].image;
    }
  }
}

export function getAllIcons() {
  return iconRegistry.map(icon => icon);
}
