/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.awsMskCluster.activeControllers'),
    metric: 'active_controller_count',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.awsMskCluster.topics'),
    metric: 'global_topic_count',
    formatters: number.compact
  }
];
