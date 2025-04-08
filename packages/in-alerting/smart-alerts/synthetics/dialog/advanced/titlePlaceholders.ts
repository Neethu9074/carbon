/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { replacePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/components/dialog/advanced/placeholderUtil';
import { severityPlaceholder } from 'in-alerting/smart-alerts/utils/commonPlaceholderConstants';
import { t } from 'in-i18n';

export interface Placeholder {
  template: string;
  name: string;
}

const syntheticTestNamePlaceholder: Readonly<Placeholder> = Object.freeze({
  template: '${synthetic.testName}',
  name: t('in-alerting:smartAlerts.synthetics.advanced.syntheticTestNamePlaceholder')
});

const syntheticLocationLabelPlaceholder: Readonly<Placeholder> = Object.freeze({
  template: '${synthetic.locationLabel}',
  name: t('in-alerting:smartAlerts.synthetics.advanced.syntheticLocationLabelPlaceholder')
});

/**
 * For now, we only have per-location test. So by default allowing synthetic test and location.
 */
export const allowedPlaceholders: ReadonlyArray<Readonly<Placeholder>> = Object.freeze([
  syntheticTestNamePlaceholder,
  syntheticLocationLabelPlaceholder,
  severityPlaceholder
]);

export function replaceTitlePlaceholdersWithMarkup(configName: string) {
  return replacePlaceholdersWithMarkup(allowedPlaceholders, configName);
}
