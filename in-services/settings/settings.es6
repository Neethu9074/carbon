import { create } from 'reactive-observables';
import { createLogger } from 'instalog';

import { saveSettings } from 'in-services/api/settings';
const logger = createLogger('SearchBar/stores/filers');

export const settingsStore = create({ emitLatestOnSubscribe: true });
export const settings$ = settingsStore;

settingsStore.emit(window.instana.settings);

export function setIn(key, value) {
  saveProperty(key, value);
}

export function set(settings) {
  const result$ = saveSettings(settings);
  result$.errors().once(error => {
    logger.error(`failed to save settings: ${settings} ${error.message}`, error);
  });
  result$.once(savedBackendSettings => {
    window.instana.settings = savedBackendSettings;
    settingsStore.emit(window.instana.settings);
  });
}

export function toggleIn(key) {
  saveProperty(key, !window.instana.settings[key]);
}

export function getSetting$(key) {
  return settingsStore.map(set => set[key]).distinct();
}

function saveProperty(key, value) {
  // optimistic write
  const oldValue = window.instana.settings[key];
  window.instana.settings[key] = value;
  settingsStore.emit(window.instana.settings);

  const result$ = saveSettings(window.instana.settings);
  result$.errors().once(error => {
    // rollback on error
    window.instana.settings[key] = oldValue;
    settingsStore.emit(window.instana.settings);
    logger.error(`failed to save settings: ${error.message}`, error);
  });
}
