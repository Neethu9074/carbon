/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { hitRateTwoDecimalPlaces, micros } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.oracleDB.dbTimeSecond'),
    metric: 'stats.dbTime',
    formatter: micros.detailed
  },
  {
    label: t('in-forge:plugins.oracleDB.dbCpuTimeDbRatio'),
    metric: 'stats.cpuTimeDbTimeRatio',
    formatter: hitRateTwoDecimalPlaces
  }
];
