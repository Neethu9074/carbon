import { create } from 'reactive-observables';
import { createLogger } from 'instalog';
import { get } from 'lodash';

import { saveSettings } from 'in-api/settings';
const logger = createLogger('SearchBar/stores/filers');

export const settingsStore = create({ emitLatestOnSubscribe: true });
export const settings$ = settingsStore;

// apply default
if (window.instana.settings) {
  window.instana.settings.map_excludeExternalServices = window.instana.settings.map_excludeExternalServices || false;
}
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

// Usage discouraged because you will not get informed about settings changes. Consider using
// getSettings$
export function getSetting(key, fallback) {
  return get(window, ['instana', 'settings', key], fallback);
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
