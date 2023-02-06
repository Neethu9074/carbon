/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import theme from 'in-themes';
import { t } from 'in-i18n';

export const maxInitialLogLines = 200;
export const customChartHeight = 215;
export const maxRetrievalSize = 200;
export const logLevelColors: Record<string, string> = {
  error: theme.lib.colors.failure,
  warn: theme.lib.colors.warning,
  info: theme.lib.colors.lightBlue800,
  debug: theme.lib.colors.black,
  trace: theme.lib.colors.black
};
export const logsChartOptions = {
  templates: [],
  metrics: [
    {
      metricId: 'logs_distribution',
      label: t('in-logging:logs'),
      formatter: 'number.compact',
      aggregations: [
        {
          id: 'SUM',
          label: t('in-logging:sum'),
          renderers: [{ id: 'bar', label: t('in-logging:bar') }]
        }
      ]
    }
  ]
};
