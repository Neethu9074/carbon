/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export function isWindows(snapshot) {
  return !!snapshot.getIn(['data', 'os.name'], '').match(/windows/i);
}

export function isZos(snapshot) {
  return !!snapshot.getIn(['data', 'os.name'], '').match(/z\/OS/i);
}

export function isLinux(snapshot) {
  return snapshot.getIn(['data', 'os.name'], '').match(/linux/i);
}

export function isMacOs(snapshot) {
  return snapshot.getIn(['data', 'os.name'], '').match(/Mac OS/i);
}

export function isAixOs(snapshot) {
  return snapshot.getIn(['data', 'os.name'], '').match(/AIX/i);
}

export function supportsOpenFiles(snapshot) {
  return !isWindows(snapshot) && !isZos(snapshot) && !isAixOs(snapshot);
}
