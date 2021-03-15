/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

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
