import {combineLatest} from 'reactive-observables';
import {createLogger} from 'instalog';

import {hashCode} from 'in-services/formatters/string';
import {createStore} from 'in-stores/store';
import http from 'in-services/http';

const logger = createLogger('in-stores/releaseNotes');
const localStorageKey = 'in-read-release-notes';

// stores the hashCode os the latest read release notes. This is used to implement
// the "mark-as-read" functionality.
const readReleaseNotesStore = createStore({
  name: 'readReleaseNotes',
  initialValue: Number(localStorage.getItem(localStorageKey) || 0)
});

// ensure that the read state is persisted in localStorage
readReleaseNotesStore.observable
  .skipFirst()
  .distinct()
  .subscribe(readReleaseNotes => {
    localStorage.setItem(localStorageKey, readReleaseNotes);
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

retrieveLatestReleaseNotes();
setInterval(retrieveLatestReleaseNotes, 1000 * 60 * 10);

function retrieveLatestReleaseNotes() {
  const observable = http({
    method: 'GET',
    url: '/notifications/release-notes.md?cacheBust=' + Date.now(),
    responseType: 'text'
  });

  observable.once(response => {
    const body = (response.body || '').trim();
    if (body.length === 0) {
      currentReleaseNotesStore.applyStateMutation(() => null);
    } else {
      currentReleaseNotesStore.applyStateMutation(() => body);
    }
  });

  observable.errors().once(err => {
    logger.warn('Failed to retrieve maintenance document', err);
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
