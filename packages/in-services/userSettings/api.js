/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { createLogger } from '@instana/logger';

import { saveUserSettings as saveUserSettingsInternal } from 'in-settings/api/userSettings';
import { userSettings } from 'in-services/userSettings/globals';

const logger = createLogger('in-settings/tabs/UserSettings/pages/General.js');

export function saveUserSettings(changedSettings, successCallback) {
  const settings = { ...userSettings, ...changedSettings };
  saveUserSettingsInternal(settings).once(successCallback, error => {
    logger.error(`failed to save settings: ${settings} ${error.message}`, error);
  });
}
