/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export default function isAtLeastMinorVersion(version, majorVersion, minorVersion) {
  if (!version || version.startsWith('pre-')) {
    return false;
  }
  const versionArray = version.split('.', 2);
  return versionArray.length > 1 && versionArray[0] == majorVersion && versionArray[1] >= minorVersion;
}
