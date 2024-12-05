/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createLogger } from '@instana/logger';

import { updateTermsAndPrivacySettings } from 'in-settings/terms/stores/termsAndPrivacySettingsStore';
import { saveUserSettings } from 'in-settings/api/userSettings';
import { t } from 'in-i18n';

const logger = createLogger('termsAndPrivacySettingsStore');

export function setAndSave(settings, successCallback, errorCallback) {
  saveUserSettings(settings).once(
    savedBackendSettings => {
      window.instana.termsAndPrivacySettings = savedBackendSettings;
      updateTermsAndPrivacySettings(savedBackendSettings);
      successCallback();
    },
    error => {
      logger.error(t('in-settings:terms.failedToSaveSettings', { settings: settings, err: error.message }), error);
      errorCallback(error);
    }
  );
}

export function formUserSettingsObject(form) {
  return Object.freeze({
    allAnalyticsServices: form.get('allAnalyticsServices').value,
    walkmeAnalyticsServices: form.get('walkmeAnalyticsServices').value,
    allSupportAndResearchServices: form.get('allSupportAndResearchServices').value,
    marketingMessages: form.get('marketingMessages').value,
    productTips: form.get('productTips').value,
    role: form.get('role').value,
    testingGroup: form.get('testingGroup').value,
    dynamicRole: form.get('dynamicRole') ? form.get('dynamicRole').value : '',
    showUserGoalSelection: form.get('showUserGoalSelection').value
  });
}
