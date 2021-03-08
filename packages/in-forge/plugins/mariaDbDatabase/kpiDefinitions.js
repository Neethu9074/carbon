/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.mariaDbDatabase.queries'),
    metric: 'status.QUERIES',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.mariaDbDatabase.clientConnections'),
    metric: 'status.THREADS_CONNECTED',
    formatter: number.compact
  }
];
