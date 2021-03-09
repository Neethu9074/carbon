/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.pingDirectory.operations'),
    metric: 'operations_in_progress',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.pingDirectory.establishedConnectionsKpiLabel'),
    metric: 'established_connections',
    formatter: zeroDecimalPlaces
  }
];
