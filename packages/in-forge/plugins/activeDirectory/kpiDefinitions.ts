/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';
export default [
  {
    metric: 'stats.lightweightDirectoryAccessProtocol.outboundBytes',
    label: t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.outboundBytes'),
    formatter: number.compact
  }
];
