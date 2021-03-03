/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.tibcoEMS.labelConnections'),
    metric: 'connectionCount',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.tibcoEMS.labelSessions'),
    metric: 'sessionCount',
    formatters: number.compact
  }
];
