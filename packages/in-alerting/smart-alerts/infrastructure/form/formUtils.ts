/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { t } from 'in-i18n';

//Below function needs to be updated once the Metric, threshold etc. are implemented.

export function getTitlePlaceholder() {
  return t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.properties.alertPropertiesTitlePlaceholder');
}

export function getDescriptionPlaceholder() {
  return t(
    'in-alerting:smartAlerts.infrastructure.advancedModeContainer.properties.alertPropertiesDescriptionPlaceholder'
  );
}
