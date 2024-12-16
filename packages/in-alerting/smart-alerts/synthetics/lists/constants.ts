/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { deepFreeze } from 'in-services/util/object';
import { t } from 'in-i18n';

export const sortOptions = deepFreeze([
  { label: t('in-alerting:smartAlerts.sortOptions.name'), value: 'name' },
  { label: t('in-alerting:smartAlerts.sortOptions.enabled'), value: 'enabled' },
  { label: t('in-alerting:smartAlerts.sortOptions.disabled'), value: 'disabled' },
  { label: t('in-alerting:smartAlerts.sortOptions.severity'), value: 'severity' },
  { label: t('in-alerting:smartAlerts.sortOptions.initialCreated'), value: 'initialCreated' },
  { label: t('in-alerting:smartAlerts.sortOptions.created'), value: 'created' }
]);
