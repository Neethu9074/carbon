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
    return snapshot.get('label', 'Unknown');
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
