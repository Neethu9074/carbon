import { createLogger } from '@instana/logger';

import { saveUserSettings } from 'in-settings/api/userSettings';

const logger = createLogger('in-settings/terms/termsAndPrivacySettingsStore.js');

export function setAndSave(settings, successCallback, errorCallback) {
  saveUserSettings(settings).once(
    savedBackendSettings => {
      window.instana.termsAndPrivacySettings = savedBackendSettings;
      successCallback();
    },
    error => {
      logger.error(`failed to save settings: ${settings} ${error.message}`, error);
      errorCallback(error);
    }
  );
}

export function formUserSettingsObject(form) {
  return Object.freeze({
    allAnalyticsServices: form.get('allAnalyticsServices').value,
    allSupportAndResearchServices: form.get('allSupportAndResearchServices').value,
    marketingMessages: form.get('marketingMessages').value,
    productTips: form.get('productTips').value,
    role: form.get('role').value,
    testingGroup: form.get('testingGroup').value,
    dynamicRole: form.get('dynamicRole') ? form.get('dynamicRole').value : ''
  });
}
