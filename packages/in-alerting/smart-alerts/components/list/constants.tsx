/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { deepFreeze } from 'in-services/util/object';
import { t } from 'in-i18n';

export const categoryLocal = 'local';
export const categoryGlobal = 'global';
export const cancelUrl = 'cancelUrl';
export const sortOption = {
  name: 'name',
  blueprint: 'blueprint',
  enabled: 'enabled',
  disabled: 'disabled',
  severity: 'severity',
  initialCreated: 'initialCreated',
  created: 'created'
};
export const sortOptions = deepFreeze([
  { label: t('in-alerting:smartAlerts.sortOptions.name'), value: sortOption.name },
  { label: t('in-alerting:smartAlerts.sortOptions.blueprint'), value: sortOption.blueprint },
  { label: t('in-alerting:smartAlerts.sortOptions.enabled'), value: sortOption.enabled },
  { label: t('in-alerting:smartAlerts.sortOptions.disabled'), value: sortOption.disabled },
  { label: t('in-alerting:smartAlerts.sortOptions.severity'), value: sortOption.severity },
  { label: t('in-alerting:smartAlerts.sortOptions.initialCreated'), value: sortOption.initialCreated },
  { label: t('in-alerting:smartAlerts.sortOptions.created'), value: sortOption.created }
]);

export function isCategoryGlobal(categorySelected: string | undefined) {
  return categorySelected === categoryGlobal;
}
export function isCategoryLocal(categorySelected: string | undefined) {
  return categorySelected === categoryLocal;
}
