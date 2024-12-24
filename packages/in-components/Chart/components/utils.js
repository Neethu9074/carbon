/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { t } from 'in-i18n';

export function checkLogLevel(facets, label, formModel) {
  const facetLogLevels = facets?.['log.level'] || [];

  const modelLogLevels =
    formModel?.filter(item => item.name === 'log.level' && item.type === 'TAG_FILTER').map(item => item.value) || [];

  const logLevels = [...facetLogLevels, ...modelLogLevels];

  if (logLevels.length === 0) {
    return false;
  }

  const normalizedLabel = label.trim().toUpperCase();

  return !logLevels.some(logLevel => {
    const normalizedLogLevel = ['ERROR', 'WARN', 'INFO', 'FATAL'].includes(logLevel.trim().toUpperCase())
      ? t('in-logging:logsOverTime', { context: logLevel.trim().toUpperCase() }).trim().toUpperCase()
      : logLevel.trim().toUpperCase();

    return normalizedLogLevel === normalizedLabel;
  });
}
