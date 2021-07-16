/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create, Observable } from '@instana/observables';
import { createLogger } from '@instana/logger';

import { saveSettings, saveSetting } from 'in-api/settings';
import { UiSettings } from 'in-types/globals';

const logger = createLogger('SearchBar/stores/settings');

export const settings$ = create<UiSettings>();

window.instana.settings = window.instana.settings || {};
// apply default
window.instana.settings.map_excludeExternalServices = window.instana.settings.map_excludeExternalServices || false;
settings$.emit(window.instana.settings);

export function set(settings: UiSettings) {
  const result$ = saveSettings(settings);
  result$.errors().once(error => {
    logger.error(`failed to save settings: ${settings} ${error.message}`, error);
  });
  result$.once(savedBackendSettings => {
    window.instana.settings = savedBackendSettings;
    settings$.emit(savedBackendSettings);
  });
}

export function setSingle(key: string, value: any) {
  saveProperty(key, value);
}

export function toggle(key: string) {
  saveProperty(key, !window.instana.settings?.[key]);
}

// Fire and forget: Usage discouraged because you will not get informed about settings changes. Consider using getSettings$
export function getSingle<T>(key: string, fallback?: T): T {
  return window.instana.settings?.[key] ?? fallback;
}

export function getSetting$<T>(key: string): Observable<T> {
  return settings$.map(set => (Object.prototype.hasOwnProperty.call(set, key) ? set[key] : null)).distinct();
}

function saveProperty(key: string, value: any) {
  if (!window.instana.settings) {
    window.instana.settings = {};
  }

  // optimistic write
  const oldValue = window.instana.settings[key];
  window.instana.settings[key] = value;
  settings$.emit(window.instana.settings);

  const result$ = saveSetting(key, value);
  result$.errors().once(error => {
    if (!window.instana.settings) {
      window.instana.settings = {};
    }

    // rollback on error
    window.instana.settings[key] = oldValue;
    settings$.emit(window.instana.settings);
    logger.error(`failed to save setting (key: ${key}, value: ${value}): ${error.message}`, error);
  });
}
