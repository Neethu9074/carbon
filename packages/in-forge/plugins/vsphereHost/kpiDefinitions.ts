/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

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
