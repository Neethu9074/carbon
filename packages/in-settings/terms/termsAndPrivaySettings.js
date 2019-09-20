import { saveUserSettings } from 'in-settings/api/userSettings';
import { createLogger } from 'instalog';

const logger = createLogger('in-settings/terms/termsAndPrivacySettingsStore.js');

export function setAndSave(settings, errorCallback) {
  saveUserSettings(settings).once(
    savedBackendSettings => {
      window.instana.termsAndPrivacySettings = savedBackendSettings;
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
    testingGroup: form.get('testingGroup').value
  });
}
