/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { healthFormatter } from 'in-forge/plugins/ceph/formatters';
import { bytes } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.ceph.labelOverallStatus'),
    metric: 'overall_status',
    formatter: healthFormatter
  },
  {
    label: t('in-forge:plugins.ceph.labelActiveMonitors'),
    metric: 'num_active_mons',
    formatter: bytes.compact
  }
];
