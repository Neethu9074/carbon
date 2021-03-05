/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.jbossDataGrid.localConnections'),
    metric: 'hotRod.numberOfLocalConnections',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.jbossDataGrid.globalConnections'),
    metric: 'hotRod.numberOfGlobalConnections',
    formatter: zeroDecimalPlaces
  }
];
