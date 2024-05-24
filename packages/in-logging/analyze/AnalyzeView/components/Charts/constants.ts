/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { carbonAlert, carbonCategorical } from 'in-themes/chartColors';
import { LowercaseLogLevel } from 'in-logging/components/types';
import { t } from 'in-i18n';

export const maxInitialLogLines = 2000;
export const customChartHeight = 215;
export const maxRetrievalSize = 2000;
export const logLevelColors: Record<LowercaseLogLevel, string> = {
  error: carbonCategorical.red50,
  warn: carbonCategorical.yellow50,
  info: carbonCategorical.cyan50,
  fatal: carbonCategorical.purple50,
  trace: carbonCategorical.teal70,
  debug: carbonCategorical.teal70,
  none: carbonCategorical.teal70,
  unknown: carbonAlert.gray60,
  nextloglevel: carbonCategorical.teal50
};

export const getLogLevelColor = (logLevel?: string) => {
  if (logLevel) {
    return logLevelColors[logLevel.toLowerCase() as LowercaseLogLevel] || logLevelColors.unknown;
  }
  return logLevelColors.unknown;
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
