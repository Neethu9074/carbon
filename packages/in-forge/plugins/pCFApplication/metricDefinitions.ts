/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['instances', 'runningInstances'],
    labels: [t('in-forge:plugins.pCFApplication.instances'), t('in-forge:plugins.pCFApplication.runningInstances')],
    min: 0,
    formatter: number
  }
];
