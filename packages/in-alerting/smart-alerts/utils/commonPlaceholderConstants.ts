/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Placeholder } from 'in-alerting/smart-alerts/synthetics/dialog/advanced/titlePlaceholders';
import { t } from 'in-i18n';

export const severityPlaceholder: Readonly<Placeholder> = Object.freeze({
  template: '${severity}',
  name: t('in-alerting:smartAlerts.placeholder.severity')
});

export const severityPlaceholderList: Readonly<Array<Placeholder>> = [severityPlaceholder];
