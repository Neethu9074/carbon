import getUiBackendVersion from 'in-subscription/getUiBackendVersion';

let latestVersion;

export function init() {
  getUiBackendVersion().subscribe(v => {
    latestVersion = v;
  });
}

export function getCorrectIdToUseForTransitionPhase(internalId, id) {
  if (!internalId) {
    return id;
  }

  if (!latestVersion?.imageTag) {
    return internalId;
  }

  if (latestVersion.imageTag.startsWith('2.190.')) {
    return id;
  }

  return internalId;
}
