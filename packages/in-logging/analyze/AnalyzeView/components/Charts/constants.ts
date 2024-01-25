/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { themes } from '@instana/design-tokens';

import { carbonAlert } from 'in-themes/chartColors';
import { t } from 'in-i18n';

export const maxInitialLogLines = 200;
export const customChartHeight = 215;
export const maxRetrievalSize = 200;
export const logLevelColors: Record<string, string> = {
  error: carbonAlert.red60,
  warn: carbonAlert.yellow30,
  info: carbonAlert.blue70,
  debug: themes.default.ids.color.option.black,
  trace: themes.default.ids.color.option.black
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
