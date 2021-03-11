/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import semver from 'semver';

import getUiBackendVersion from 'in-subscription/getUiBackendVersion';
import { releaseNotesEnabled } from 'in-services/featureFlags';
import { build as uiClientBuildInfo } from 'in-services/config';
import { tryGet, trySet } from 'in-services/localStorage';
import { combineLatest } from '@instana/observables';
import { createStore } from 'in-stores/store';
import { createLogger } from '@instana/logger';
import http from 'in-services/http';

const logger = createLogger('in-stores.releaseNotes');

const releaseNotesBaseUrl = '/notifications/release-notes';
const localStorageKeyVersion = 'in-read-release-notes-version';
let noBuildInformationWarningHasBeenLogged = false;
let noReleaseNotesWarningHasBeenLogged = false;
let fetchLaterHandle;

const noReleaseNotesContent = {
  version: null,
  content: null
};

// ui-client version modulo patch level (x.y.z will become x.y)
const uiClientVersionMajorMinor =
  uiClientBuildInfo && uiClientBuildInfo.tag ? removePatchLevel(uiClientBuildInfo.tag) : null;

// Stores the major.minor version for which the user has read the release notes. This is used to implement the
// "mark-as-read" functionality.
const releaseNotesVersionReadByUserStore = createStore({
  name: 'releaseNotesVersionReadByUser',
  initialValue: tryGet(localStorageKeyVersion) || 'none'
});

// ensure that the read state is persisted in localStorage
releaseNotesVersionReadByUserStore.observable
  .skipFirst()
  .distinct()
  .subscribe(releaseNotesVersionReadByUser => {
    trySet(localStorageKeyVersion, releaseNotesVersionReadByUser);
  });

// Stores the markdown content of the release notes matching the currently running version of Instana. In contrast to
// unreadReleaseNotesContentAndVersion$ it does not care if the user has read them or not.
const currentReleaseNotesContentStore = createStore({
  name: 'currentReleaseNotes',
  initialValue: null
});

const currentReleaseNotesContent$ = currentReleaseNotesContentStore.observable.distinct();

// This observable yields the an object containing the  markdown content of the release notes and their version,
// matching the currently running version, but only if the user hasn't seen them yet. Otherwise it will yield null for
// both values. This is used to show the popup with release notes for a new version to each user exactly once.
export const unreadReleaseNotesContentAndVersion$ = combineLatest([
  releaseNotesVersionReadByUserStore.observable,
  currentReleaseNotesContent$,
  getUiBackendVersion()
]).map(([readVersion, currentReleaseNotes, uiBackendVersionData]) => {
  const currentlyRunningVersionMajorMinor = getCurrentlyRunningVersionMajorMinor(uiBackendVersionData);
  if (!currentlyRunningVersionMajorMinor) {
    // We do not have any information about the version that is currently running (neither from the static
    // ui-client build.json or from the back end API call).
    return noReleaseNotesContent;
  }
  if (!currentReleaseNotes) {
    // Either there are no release notes for the currently running version or we did not retrieve them yet.
    return noReleaseNotesContent;
  }
  if (readVersion === currentlyRunningVersionMajorMinor) {
    // the user has already seen the release notes popup for this version,
    return noReleaseNotesContent;
  }
  // This (probably new) user hasn't seen any release notes yet, ever. For a better first time experience, we do not
  // throw release notes at their face now, but remember the current version as the version for which they have read the
  // release notes.
  if (readVersion === 'none') {
    trySet(localStorageKeyVersion, currentlyRunningVersionMajorMinor);
    return noReleaseNotesContent;
  }
  return {
    version: currentlyRunningVersionMajorMinor,
    content: currentReleaseNotes
  };
});

if (releaseNotesEnabled) {
  retrieveLatestReleaseNotes();
}

function retrieveLatestReleaseNotes() {
  getUiBackendVersion().once(uiBackendVersionData => {
    const currentlyRunningVersionMajorMinor = getCurrentlyRunningVersionMajorMinor(uiBackendVersionData);
    if (!currentlyRunningVersionMajorMinor) {
      // We do not have any information about the version that is currently running (neither from the static
      // ui-client build.json or from the back end API call), so we cannot fetch any release notes.
      return;
    }

    const indexObservable = http({
      method: 'GET',
      maxRetries: 3,
      url: `${releaseNotesBaseUrl}/index.json?cacheBust=${Date.now()}`,
      responseType: 'text'
    });
    indexObservable.once(
      indexResponse => {
        processReleaseNotesIndex(indexResponse, currentlyRunningVersionMajorMinor);
      },
      // ignore HTTP errors silently and try again later
      tryFetchingReleaseNotesLater
    );
  });
}

function tryFetchingReleaseNotesLater() {
  if (fetchLaterHandle) {
    clearTimeout(fetchLaterHandle);
  }
  fetchLaterHandle = setTimeout(retrieveLatestReleaseNotes, 10 * 60 * 1000 /* try again ten minutes later */);
}

function processReleaseNotesIndex(indexResponse, currentlyRunningVersionMajorMinor) {
  if (!indexResponse.body || indexResponse.body.length === 0) {
    tryFetchingReleaseNotesLater();
    return;
  }
  try {
    const index = JSON.parse(indexResponse.body);
    if (!index[currentlyRunningVersionMajorMinor] || !index[currentlyRunningVersionMajorMinor].link) {
      // There are no release notes for the currently active release (yet).
      if (!noReleaseNotesWarningHasBeenLogged) {
        logger.warn('No release notes available for release ' + currentlyRunningVersionMajorMinor + '.');
        noReleaseNotesWarningHasBeenLogged = true;
      }
      tryFetchingReleaseNotesLater();
      return;
    }
    const releaseNotesLink = index[currentlyRunningVersionMajorMinor].link;
    const releaseNotesObservable = http({
      method: 'GET',
      maxRetries: 3,
      url: `${releaseNotesBaseUrl}/${releaseNotesLink}?cacheBust=${Date.now()}`,
      responseType: 'text'
    });

    releaseNotesObservable.once(
      processReleaseNotesMarkdown,
      // ignore HTTP errors silently and try again later
      tryFetchingReleaseNotesLater
    );
  } catch (e) {
    logger.warn('Could not parse release notes index.');
    tryFetchingReleaseNotesLater();
  }
}

function processReleaseNotesMarkdown(response) {
  const body = (response.body || '').trim();
  if (body.length === 0) {
    currentReleaseNotesContentStore.mutateTo(null);
  } else {
    currentReleaseNotesContentStore.mutateTo(body);
  }
}

export function markAsRead(majorMinor) {
  if (majorMinor) {
    releaseNotesVersionReadByUserStore.applyStateMutation(() => majorMinor);
  }
}

export function showReleaseNotes() {
  // This just makes it sure that the value stored in releaseNotesVersionReadByUserStore and the currently running
  // version will not match.
  releaseNotesVersionReadByUserStore.applyStateMutation(() => 'show again');
}

/**
 * Returns the major and minor number of the currently running version of Instana as a string, that is, "1.147". Patch
 * level information is discarded. Being composed of a large number of different components that could run in different
 * versions, the "currently running version" is a concept that is not trivial. For now we just query the versions of
 * ui-backend and ui-client and use the minimum of these two version numbers.
 */
function getCurrentlyRunningVersionMajorMinor(uiBackendVersionData) {
  const backEndMajorMinor = parseBackEndVersionData(uiBackendVersionData);
  const currentlyRunningVersionMajorMinor = minimumOf(backEndMajorMinor, uiClientVersionMajorMinor);
  if (!currentlyRunningVersionMajorMinor) {
    // We do not have any information about the version that is currently running (neither from the static
    // ui-client build.json or from the back end API call).
    if (!noBuildInformationWarningHasBeenLogged) {
      logger.warn("No information about the build is available, can't load matching release notes.");
      noBuildInformationWarningHasBeenLogged = true;
    }
    return null;
  }
  return currentlyRunningVersionMajorMinor;
}

function parseBackEndVersionData(uiBackendVersionData) {
  if (!uiBackendVersionData) {
    return null;
  }
  return removePatchLevel(uiBackendVersionData.imageTag);
}

function minimumOf(majorMinor1, majorMinor2) {
  const version1 = addDummyPatchLevel(majorMinor1);
  const version2 = addDummyPatchLevel(majorMinor2);
  if (!semver.valid(version1) && !semver.valid(version2)) {
    return null;
  }
  if (semver.valid(version1) && !semver.valid(version2)) {
    return majorMinor1;
  }
  if (!semver.valid(version1) && semver.valid(version2)) {
    return majorMinor2;
  }
  if (semver.lt(version1, version2)) {
    return majorMinor1;
  } else {
    return majorMinor2;
  }
}

function removePatchLevel(version) {
  if (!version || !semver.valid(version)) {
    return null;
  }
  return `${semver.major(version)}.${semver.minor(version)}`;
}

function addDummyPatchLevel(majorMinor) {
  if (!majorMinor) {
    return null;
  }
  return `${majorMinor}.0`;
}
