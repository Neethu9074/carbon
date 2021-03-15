/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytes, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.mongoDb.connections'),
    metric: 'connections',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.mongoDb.databaseSize'),
    metric: 'totalDbSize',
    formatter: bytes.detailed
  }
];
