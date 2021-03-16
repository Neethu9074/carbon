/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/defaultEntity20/metricDefinitions';
import { ms, number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default metricDefinitions
  .filter(definition => definition.metric !== 'instances')
  .concat([
    {
      metric: 'inbound_count',
      label: t('in-forge:plugins.application.inboundCallsS'),
      category: [t('in-forge:plugins.application.inboundCalls')],
      min: 0,
      formatter: number
    },
    {
      metric: 'inbound_error_count',
      label: t('in-forge:plugins.application.inboundErroneousCallsS'),
      category: [t('in-forge:plugins.application.inboundCalls')],
      min: 0,
      formatter: number
    },
    {
      metrics: ['inbound_duration.mean', 'inbound_duration.min', 'inbound_duration.max'],
      labels: [
        t('in-forge:plugins.application.inboundCallsAvgLatency'),
        t('in-forge:plugins.application.inboundCallsMinLatency'),
        t('in-forge:plugins.application.inboundCallsMaxLatency')
      ],
      category: [t('in-forge:plugins.application.inboundCallsLatency')],
      min: 0,
      formatter: ms
    },
    {
      metrics: [
        'inbound_duration.25th',
        'inbound_duration.50th',
        'inbound_duration.75th',
        'inbound_duration.95th',
        'inbound_duration.98th',
        'inbound_duration.99th'
      ],
      labels: [
        t('in-forge:plugins.application.inboundCallsLatency25th'),
        t('in-forge:plugins.application.inboundCallsLatency50th'),
        t('in-forge:plugins.application.inboundCallsLatency75th'),
        t('in-forge:plugins.application.inboundCallsLatency95th'),
        t('in-forge:plugins.application.inboundCallsLatency98th'),
        t('in-forge:plugins.application.inboundCallsLatency99th')
      ],
      category: [t('in-forge:plugins.application.inboundCallsLatency')],
      min: 0,
      formatter: ms,
      isPercentile: true
    },
    {
      metric: 'inbound_error_rate',
      label: t('in-forge:plugins.application.inboundErroneousCallRate'),
      category: [t('in-forge:plugins.application.inboundCalls')],
      min: 0,
      formatter: percentage
    }
  ]);
