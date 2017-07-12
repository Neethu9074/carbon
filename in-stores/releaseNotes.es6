import { combineLatest } from 'reactive-observables';

import { hashCode } from 'in-services/formatters/string';
import { trySet, get } from 'in-services/localStorage';
import { isOnPremise } from 'in-services/config';
import { createStore } from 'in-stores/store';
import http from 'in-services/http';

const localStorageKey = 'in-read-release-notes';

// stores the hashCode os the latest read release notes. This is used to implement
// the "mark-as-read" functionality.
const readReleaseNotesStore = createStore({
  name: 'readReleaseNotes',
  initialValue: Number(get(localStorageKey) || 0)
});

// ensure that the read state is persisted in localStorage
readReleaseNotesStore.observable.skipFirst().distinct().subscribe(readReleaseNotes => {
  trySet(localStorageKey, readReleaseNotes);
});

// stores the latest release notes, but does not account for the users read state
const currentReleaseNotesStore = createStore({
  name: 'currentReleaseNotes',
  initialValue: null
});

const currentReleaseNotes$ = currentReleaseNotesStore.observable.distinct();

export const releaseNotes$ = combineLatest([
  readReleaseNotesStore.observable,
  currentReleaseNotes$
]).map(([readState, currentReleaseNotes]) => {
  if (readState === hashCode(currentReleaseNotes)) {
    return null;
  }
  return currentReleaseNotes;
});

if (!isOnPremise()) {
  retrieveLatestReleaseNotes();
  setInterval(retrieveLatestReleaseNotes, 1000 * 60 * 10);
}

function retrieveLatestReleaseNotes() {
  const observable = http({
    method: 'GET',
    maxRetries: 3,
    url: '/notifications/release-notes.md?cacheBust=' + Date.now(),
    responseType: 'text'
  });

  observable.once(response => {
    const body = (response.body || '').trim();
    if (body.length === 0) {
      currentReleaseNotesStore.mutateTo(null);
    } else {
      currentReleaseNotesStore.mutateTo(body);
    }
  });

  observable.errors().once(() => {
    // ignore HTTP errors as the system will self heal and there is no reason to notify
    // us about these types of errors.
  });
}

export function markAsRead() {
  currentReleaseNotes$.once(releaseNotes => {
    readReleaseNotesStore.applyStateMutation(() => hashCode(releaseNotes));
  });
}

export function showReleaseNotes() {
  readReleaseNotesStore.applyStateMutation(() => 0);
}
