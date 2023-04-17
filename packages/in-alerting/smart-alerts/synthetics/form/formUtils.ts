/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, MapForm } from 'formalistic';

import { t } from 'in-i18n';

export function getTitlePlaceholder() {
  return t('in-alerting:smartAlerts.synthetics.simple.alertPropertiesTitlePlaceholder');
}

export function getDescriptionPlaceholder(form: MapForm<any>) {
  const timeThresholdForm = form.get('timeThreshold') as MapForm<any>;
  const violationsCount = (timeThresholdForm.get('violationsCount') as Field<number>).value;
  return t('in-alerting:smartAlerts.synthetics.simple.alertPropertiesDescriptionPlaceholder', {
    count: violationsCount
  });
}
