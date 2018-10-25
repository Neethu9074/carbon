import { combineLatest } from 'reactive-observables';

import { releaseNotesEnabled } from 'in-services/featureFlags';
import { get, trySet } from 'in-services/localStorage';
import { createStore } from 'in-stores/store';
import { build } from 'in-services/config';
import { createLogger } from 'instalog';
import http from 'in-services/http';

const logger = createLogger('in-stores.releaseNotes');

const majorMinorRegex = /(\d+\.\d+)\.\d+/;
const majorMinor = build && build.tag && majorMinorRegex.test(build.tag) ? majorMinorRegex.exec(build.tag)[1] : null;
const releaseNotesBaseUrl = '/notifications/release-notes';
const localStorageKeyVersion = 'in-read-release-notes-version';

// Stores the major.minor version part as the last read release notes. This is used to implement
// the "mark-as-read" functionality.
const readReleaseNotesVersionStore = createStore({
  name: 'readReleaseNotesVersion',
  initialValue: get(localStorageKeyVersion) || 'none'
});

// ensure that the read state is persisted in localStorage
readReleaseNotesVersionStore.observable
  .skipFirst()
  .distinct()
  .subscribe(readReleaseNotesVersion => {
    trySet(localStorageKeyVersion, readReleaseNotesVersion);
  });

// stores the latest release notes, but does not account for the users read state
const currentReleaseNotesStore = createStore({
  name: 'currentReleaseNotes',
  initialValue: null
});

const currentReleaseNotes$ = currentReleaseNotesStore.observable.distinct();

export const releaseNotes$ = combineLatest([readReleaseNotesVersionStore.observable, currentReleaseNotes$]).map(
  ([readVersion, currentReleaseNotes]) => {
    if (readVersion === majorMinor) {
      return null;
    }
    // This (probably new) user hasn't seen any release notes yet, ever. For a better first time experience, we do not
    // throw release notes at their face now.
    if (readVersion === 'none') {
      trySet(localStorageKeyVersion, majorMinor);
      return null;
    }
    return currentReleaseNotes;
  }
);

if (releaseNotesEnabled) {
  retrieveLatestReleaseNotes();
  setInterval(retrieveLatestReleaseNotes, 1000 * 60 * 10);
}

function retrieveLatestReleaseNotes() {
  if (!majorMinor) {
    logger.warn("No information about the build is available, can't load matching release notes.");
    return;
  }

  const indexObservable = http({
    method: 'GET',
    maxRetries: 3,
    url: `${releaseNotesBaseUrl}/index.json?cacheBust=${Date.now()}`,
    responseType: 'text'
  });
  indexObservable.once(indexResponse => {
    processReleaseNotesIndex(indexResponse);
  });
  indexObservable.errors().once(() => {
    // ignore HTTP errors silently
  });
}

function processReleaseNotesIndex(indexResponse) {
  if (!indexResponse.body || indexResponse.body.length === 0) {
    return;
  }
  try {
    const index = JSON.parse(indexResponse.body);
    const releaseNotesLink = index[majorMinor].link;
    if (!releaseNotesLink) {
      return;
    }
    const releaseNotesObservable = http({
      method: 'GET',
      maxRetries: 3,
      url: `${releaseNotesBaseUrl}/${releaseNotesLink}?cacheBust=${Date.now()}`,
      responseType: 'text'
    });

    releaseNotesObservable.once(processReleaseNotesMarkdown);
    releaseNotesObservable.errors().once(() => {
      // ignore HTTP errors silently
    });
  } catch (e) {
    logger.warn('Could not parse release notes index.');
  }
}

function processReleaseNotesMarkdown(response) {
  const body = (response.body || '').trim();
  if (body.length === 0) {
    currentReleaseNotesStore.mutateTo(null);
  } else {
    currentReleaseNotesStore.mutateTo(body);
  }
}

export function markAsRead() {
  readReleaseNotesVersionStore.applyStateMutation(() => majorMinor);
}

export function showReleaseNotes() {
  readReleaseNotesVersionStore.applyStateMutation(() => 'show again');
}
