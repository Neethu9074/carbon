/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.awsBeanstalk.labelOKInstances'),
    metric: 'environment_instances_ok',
    formatter: number.compact
  },
  {
    label: 'in-forge:plugins.awsBeanstalk.labelDegradedInstances',
    metric: 'environment_instances_degraded',
    formatter: number.compact
  }
];
