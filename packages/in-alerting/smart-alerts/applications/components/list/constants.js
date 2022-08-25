/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { deepFreeze } from 'in-services/util/object';
import { t } from 'in-i18n';

export const categoryLocal = 'local';
export const categoryGlobal = 'global';
export const sortOptions = deepFreeze([
  { label: t('in-alerting:smartAlerts.sortOptions.name'), value: 'name' },
  { label: t('in-alerting:smartAlerts.sortOptions.blueprint'), value: 'blueprint' },
  { label: t('in-alerting:smartAlerts.sortOptions.enabled'), value: 'enabled' },
  { label: t('in-alerting:smartAlerts.sortOptions.disabled'), value: 'disabled' },
  { label: t('in-alerting:smartAlerts.sortOptions.severity'), value: 'severity' },
  { label: t('in-alerting:smartAlerts.sortOptions.created'), value: 'created' }
]);
