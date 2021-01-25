/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import { createLogger } from '@instana/logger';

import { saveUserSettings as saveUserSettingsInternal } from 'in-settings/api/userSettings';

const logger = createLogger('in-settings/tabs/UserSettings/pages/General.js');

export function getUserSettings() {
  return window.instana.termsAndPrivacySettings;
}

export function saveUserSettings(changedSettings, successCallback) {
  const settings = { ...getUserSettings(), ...changedSettings };
  saveUserSettingsInternal(settings).once(successCallback, error => {
    logger.error(`failed to save settings: ${settings} ${error.message}`, error);
  });
}
