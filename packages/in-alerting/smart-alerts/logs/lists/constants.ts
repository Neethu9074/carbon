/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { sortOption } from 'in-alerting/smart-alerts/components/list/constants';
import { deepFreeze } from 'in-services/util/object';
import { t } from 'in-i18n';

export const sortOptions = deepFreeze([
  { label: t('in-alerting:smartAlerts.sortOptions.name'), value: sortOption.name },
  { label: t('in-alerting:smartAlerts.sortOptions.enabled'), value: sortOption.enabled },
  { label: t('in-alerting:smartAlerts.sortOptions.disabled'), value: sortOption.disabled },
  { label: t('in-alerting:smartAlerts.sortOptions.initialCreated'), value: sortOption.initialCreated },
  { label: t('in-alerting:smartAlerts.sortOptions.created'), value: sortOption.created }
]);
