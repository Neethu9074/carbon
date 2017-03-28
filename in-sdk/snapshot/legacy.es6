export function addLabelFinder() {
  // TODO remove all UI label impls
}

export function getLabel(snapshot) {
  return snapshot.get('label', 'Unknown');
}
