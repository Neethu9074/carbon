/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { percentage } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.vsphereHost.labelCPUUsage'),
    metric: 'cpu.usage.maximum.percent',
    formatter: percentage.detailed
  },
  {
    label: t('in-forge:plugins.vsphereHost.labelCPUReadiness'),
    metric: 'cpu.readiness.average.percent',
    formatter: percentage.detailed
  }
];
