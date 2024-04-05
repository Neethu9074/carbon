/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.db2Database.connections'),
    metric: 'databases.connectionsCount',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.db2Database.queries'),
    metric: 'databases.queries',
    formatter: number.compact
  }
];
