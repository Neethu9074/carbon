/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'Availability',
    label: t('in-forge:plugins.aliCloudOssBucket.availability'),
    category: [t('in-forge:plugins.aliCloudOssBucket.availability')],
    formatter: percentage
  },
  {
    metric: 'RequestValidRate',
    label: t('in-forge:plugins.aliCloudOssBucket.requestValidRate'),
    category: [t('in-forge:plugins.aliCloudOssBucket.requestValidRate')],
    formatter: percentage
  }
];
