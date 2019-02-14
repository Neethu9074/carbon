export function isWindows(snapshot) {
  return !!snapshot.getIn(['data', 'os.name'], '').match(/windows/i);
}
export function isZos(snapshot) {
  return !!snapshot.getIn(['data', 'os.name'], '').match(/z\/OS/i);
}

export function isLinux(snapshot) {
  return snapshot.getIn(['data', 'os.name'], '').match(/linux/i);
}
